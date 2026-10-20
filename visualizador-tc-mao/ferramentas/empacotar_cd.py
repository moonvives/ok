"""Empacota os arquivos ORIGINAIS de um CD de exame (pasta com DICOMDIR) para o visualizador publicado.

Nada é convertido: cada arquivo do CD (DICOM, DICOMDIR, VERSION, LOCKFILE, JPEG) entra
byte a byte em pacotes gzip (compressão sem perda), com um índice de deslocamentos e o
SHA-256 de cada arquivo. O navegador descomprime o pacote, recorta o arquivo e lê o DICOM.

Saída em <out>/exam/:
  manifest.json      estudo, resumo do DICOMDIR, séries/instâncias (metadados para montar
                     a lista antes de baixar pixels), pacotes, demais arquivos e inventário
  d<NNN>.gz          pacotes de arquivos originais
"""
import base64, collections, gzip, hashlib, io, json, os, struct, sys, zlib
import numpy as np
import pydicom

SRC, OUT = sys.argv[1], sys.argv[2]                    # SRC = raiz do CD (contém exam/DICOMDIR); OUT = pasta do site
EXAM = os.path.join(SRC, "exam")
DST = os.path.join(OUT, "exam"); os.makedirs(DST, exist_ok=True)
for n in os.listdir(DST): os.remove(os.path.join(DST, n))
PACK_RAW = 9 * 1024 * 1024                              # alvo de bytes originais por pacote
LIMIT_GZ = 14 * 1024 * 1024                             # limite por arquivo publicado (15 MB)


def sha256b(b): return hashlib.sha256(b).hexdigest()
def s(v): return "" if v is None else str(v).strip()
def flist(v): return [float(x) for x in v] if v is not None else None
def first(v):
    if v is None or v == "": return None
    return float(v[0]) if isinstance(v, pydicom.multival.MultiValue) else float(v)
def date(v): v = s(v); return f"{v[6:8]}/{v[4:6]}/{v[0:4]}" if len(v) == 8 else v


def png_rgb(arr):
    """uint8 (H,W,3) -> PNG sem perdas (miniatura)."""
    h, w, _ = arr.shape; raw = np.hstack([np.zeros((h, 1), np.uint8), arr.reshape(h, -1)])
    def ch(t, d): return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    return b"\x89PNG\r\n\x1a\n" + ch(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)) + \
        ch(b"IDAT", zlib.compress(raw.tobytes(), 9)) + ch(b"IEND", b"")


# ---------------- pacotes ----------------
packs, cur, cur_raw = [], [], 0
def flush():
    global cur, cur_raw
    if not cur: return
    name = f"d{len(packs):03d}.gz"; blob = b"".join(b for _, b in cur)
    gz = gzip.compress(blob, 9, mtime=0)
    assert len(gz) <= LIMIT_GZ, (name, len(gz))
    open(os.path.join(DST, name), "wb").write(gz)
    packs.append({"file": "exam/" + name, "size": len(gz), "rawSize": len(blob), "sha256": sha256b(gz), "count": len(cur)})
    cur, cur_raw = [], 0
def add(entry, data):
    """entry recebe pack/off/len; o pacote fecha ao atingir o alvo de tamanho."""
    global cur_raw
    if cur and cur_raw + len(data) > PACK_RAW: flush()
    entry["pack"] = len(packs); entry["off"] = cur_raw; entry["len"] = len(data)
    entry["sha256"] = sha256b(data)
    cur.append((entry, data)); cur_raw += len(data)

# ---------------- DICOMDIR ----------------
dd = pydicom.dcmread(os.path.join(EXAM, "DICOMDIR"))
ddsum = {"fileSetID": s(dd.get("FileSetID")), "transferSyntax": str(dd.file_meta.TransferSyntaxUID),
         "counts": dict(collections.Counter(r.DirectoryRecordType for r in dd.DirectoryRecordSequence)),
         "patient": {}, "study": {}, "series": []}
order = []                                            # (série atual, caminho) na ordem do DICOMDIR
for r in dd.DirectoryRecordSequence:
    t = r.DirectoryRecordType
    if t == "PATIENT": ddsum["patient"] = {"id": s(r.get("PatientID"))}
    elif t == "STUDY":
        ddsum["study"] = {"date": date(r.get("StudyDate")), "time": s(r.get("StudyTime")), "description": s(r.get("StudyDescription")),
                          "accession": s(r.get("AccessionNumber")), "id": s(r.get("StudyID"))}
    elif t == "SERIES":
        ddsum["series"].append({"number": int(r.get("SeriesNumber", 0) or 0), "modality": s(r.get("Modality")),
                                "description": s(r.get("SeriesDescription")), "uid": s(r.get("SeriesInstanceUID")), "images": 0, "folder": ""})
    elif "ReferencedFileID" in r:
        fid = r.ReferencedFileID; rel = "/".join(fid) if not isinstance(fid, str) else fid
        se = ddsum["series"][-1]; se["images"] += 1; se["folder"] = se["folder"] or "/".join(rel.split("/")[:-1])
        order.append(rel)

# ---------------- instâncias DICOM ----------------
series = collections.OrderedDict(); study = None; problems = []
for rel in order:
    p = os.path.join(EXAM, *rel.split("/"))
    if not os.path.exists(p): problems.append("ausente: " + rel); continue
    ds = pydicom.dcmread(p, stop_before_pixels=True)
    if study is None: study = ds
    uid = s(ds.get("SeriesInstanceUID"))
    se = series.setdefault(uid, {"number": int(ds.get("SeriesNumber", 0) or 0), "description": s(ds.get("SeriesDescription")),
                                 "modality": s(ds.get("Modality")), "items": []})
    se["items"].append((rel, p, ds))

meta_series = []
for uid, se in series.items():
    items = se["items"]; ds0 = items[0][2]
    color = int(ds0.get("SamplesPerPixel", 1)) == 3
    iop = flist(ds0.get("ImageOrientationPatient"))
    if iop and len(iop) == 6:
        n = np.cross(iop[:3], iop[3:])
        key = lambda it: (float(np.dot(flist(it[2].get("ImagePositionPatient")) or [0, 0, 0], n)), int(it[2].get("InstanceNumber", 0) or 0))
    else:
        key = lambda it: (0.0, int(it[2].get("InstanceNumber", 0) or 0))
    items.sort(key=key)
    flush()                                           # cada série começa em pacote próprio
    instances = []
    for rel, p, ds in items:
        data = open(p, "rb").read()
        ent = {"file": rel, "instance": int(ds.get("InstanceNumber", 0) or 0), "sop": s(ds.get("SOPInstanceUID")),
               "ipp": flist(ds.get("ImagePositionPatient")), "rows": int(ds.Rows), "cols": int(ds.Columns),
               "wc": first(ds.get("WindowCenter")), "ww": first(ds.get("WindowWidth")),
               "sliceLocation": float(ds.SliceLocation) if "SliceLocation" in ds else None,
               "ps": flist(ds.get("PixelSpacing")), "photometric": s(ds.get("PhotometricInterpretation")),
               "spp": int(ds.get("SamplesPerPixel", 1)), "bits": int(ds.get("BitsAllocated", 16)),
               "frames": int(ds.get("NumberOfFrames", 1) or 1)}
        add(ent, data); instances.append(ent)
    # miniatura: corte do meio na janela do próprio DICOM
    mi = instances[len(instances) // 2]; dsm = pydicom.dcmread(os.path.join(EXAM, *mi["file"].split("/")))
    arr = dsm.pixel_array
    if color:
        if dsm.PhotometricInterpretation != "RGB": arr = pydicom.pixels.convert_color_space(arr, dsm.PhotometricInterpretation, "RGB")
        small = arr.astype(np.uint8)
    else:
        hu = arr.astype(np.float64) * float(dsm.get("RescaleSlope", 1) or 1) + float(dsm.get("RescaleIntercept", 0) or 0)
        wc = mi["wc"] if mi["wc"] is not None else 300.0; ww = mi["ww"] if mi["ww"] else 1500.0
        g = np.clip(((hu - (wc - 0.5)) / max(ww - 1, 1) + 0.5) * 255, 0, 255).astype(np.uint8)
        small = np.repeat(g[:, :, None], 3, axis=2)
    step = max(1, max(small.shape[0], small.shape[1]) // 128)
    thumb = "data:image/png;base64," + base64.b64encode(png_rgb(np.ascontiguousarray(small[::step, ::step, :3]))).decode()
    meta_series.append({"key": f"s{se['number']}", "uid": uid, "number": se["number"], "description": se["description"],
                        "modality": se["modality"], "rows": int(ds0.Rows), "cols": int(ds0.Columns), "color": color,
                        "pixelSpacing": flist(ds0.get("PixelSpacing")),
                        "sliceThickness": float(ds0.get("SliceThickness")) if ds0.get("SliceThickness") not in (None, "") else None,
                        "iop": iop, "kernel": s(ds0.get("ConvolutionKernel")), "kvp": s(ds0.get("KVP")),
                        "folder": "/".join(items[0][0].split("/")[:-1]), "count": len(instances), "thumb": thumb, "instances": instances})

# ---------------- demais arquivos do exame (controle do CD e JPEG) ----------------
flush()
extra = []
packed = {i["file"] for m in meta_series for i in m["instances"]}
others = []                                           # DICOMDIR e demais arquivos de controle do CD
for root, _, names in os.walk(EXAM):
    for n in names:
        rel = os.path.relpath(os.path.join(root, n), EXAM).replace(os.sep, "/")
        if rel not in packed and not rel.startswith("jpeg/") and not n.endswith(".part"): others.append(rel)
for rel in sorted(others, key=lambda r: (r != "DICOMDIR", r)):
    e = {"file": rel, "kind": "dicomdir" if rel == "DICOMDIR" else "control"}
    add(e, open(os.path.join(EXAM, *rel.split("/")), "rb").read()); extra.append(e)
jdir = os.path.join(EXAM, "jpeg"); jgroups = collections.OrderedDict()
for n in sorted(os.listdir(jdir)):
    if n.lower().endswith(".jpg"): jgroups.setdefault(n.split("_")[1], []).append(n)
for sk, names in jgroups.items():
    flush()
    for n in names:
        e = {"file": "jpeg/" + n, "kind": "jpeg", "group": sk}; add(e, open(os.path.join(jdir, n), "rb").read()); extra.append(e)
flush()

# ---------------- inventário do CD inteiro ----------------
published = {"exam/" + i["file"]: i["sha256"] for m in meta_series for i in m["instances"]}
published.update({"exam/" + e["file"]: e["sha256"] for e in extra})
inventory = []
for root, _, files in os.walk(SRC):
    for n in files:
        if n.endswith(".part"): continue
        p = os.path.join(root, n); rel = os.path.relpath(p, SRC).replace(os.sep, "/")
        h = sha256b(open(p, "rb").read())
        if rel in published and published[rel] != h: problems.append("hash divergente: " + rel)
        inventory.append({"path": rel, "size": os.path.getsize(p), "sha256": h, "site": rel in published})
inventory.sort(key=lambda x: x["path"])

d0 = study
manifest = {
    "format": "cd-original-gzip-1",
    "study": {"description": s(d0.get("StudyDescription")), "date": date(d0.get("StudyDate")), "time": s(d0.get("StudyTime"))[:4],
              "accession": s(d0.get("AccessionNumber")), "institution": s(d0.get("InstitutionName")),
              "referringPhysician": s(d0.get("ReferringPhysicianName")).replace("^", " ").strip(),
              "manufacturer": s(d0.get("Manufacturer")), "model": s(d0.get("ManufacturerModelName")), "station": s(d0.get("StationName")),
              "bodyPart": s(d0.get("BodyPartExamined")), "uid": s(d0.get("StudyInstanceUID")), "id": s(d0.get("StudyID")),
              "protocol": s(d0.get("ProtocolName")), "patientPosition": s(d0.get("PatientPosition")),
              "patient": {"name": s(d0.get("PatientName")).replace("^", " ").strip(), "id": s(d0.get("PatientID")),
                          "birth": date(d0.get("PatientBirthDate")), "sex": s(d0.get("PatientSex")), "age": s(d0.get("PatientAge"))}},
    "dicomdir": ddsum, "series": meta_series, "extra": extra, "packs": packs,
    "expectedFromDicomdir": len(order), "problems": problems, "inventory": inventory,
}
json.dump(manifest, open(os.path.join(DST, "manifest.json"), "w"), ensure_ascii=False, separators=(",", ":"))

tot = sum(os.path.getsize(os.path.join(DST, f)) for f in os.listdir(DST))
print("séries:", len(meta_series), "| instâncias:", sum(m["count"] for m in meta_series), "| DICOMDIR:", len(order), ddsum["counts"])
for m in meta_series: print(f"  {m['key']:>5} {m['modality']} {m['description']!r:16} {m['count']:>4} {m['rows']}x{m['cols']} pasta={m['folder']}")
print("demais arquivos:", len(extra), "| pacotes:", len(packs), "| maior pacote:", max(p["size"] for p in packs), "bytes")
print("inventário:", len(inventory), "arquivos;", sum(1 for x in inventory if x["site"]), "no site;",
      sum(x["size"] for x in inventory if x["site"]), "bytes originais no site")
print("problemas:", problems or "nenhum")
print("dados do site:", len(os.listdir(DST)), "arquivos,", round(tot / 1e6, 1), "MB")
