import { useState, useRef, useEffect, useCallback } from "react";

// ── DATOS ─────────────────────────────────────────────────────────────────
const NODES = [
  { id:"layout",  label:"_Layout\n.cshtml",        group:"layout",    x:1800, y:80,
    info:"Plantilla base. Navbar con links Ej1/Ej2/Ej3 + @RenderBody().",
    code:"<nav asp-action=Index/Ej1/Ej2/Ej3>\n@RenderBody()" },
  { id:"hc",      label:"Home\nController",         group:"ctrl",      x:1800, y:310,
    info:"Controlador único. Contiene todas las acciones GET del proyecto.",
    code:"public class HomeController : Controller" },
  { id:"hc_list", label:"static\nlistado",          group:"vbag",      x:2260, y:310,
    info:"List<Registro> estática. Persiste durante toda la sesión de ejecución.",
    code:"static List<Registro> listado = new List<Registro>();" },
  { id:"a_idx",   label:"Index()",                  group:"action",    x:1050, y:520,
    info:"GET → View() → Index.cshtml", code:"public IActionResult Index() => View();" },
  { id:"a_ej1",   label:"Ejercicio1()",             group:"action",    x:1290, y:520,
    info:"GET → View() → Ejercicio1.cshtml vacío.", code:"public IActionResult Ejercicio1() => View();" },
  { id:"a_cpar",  label:"Calcular\nParquimetro()",  group:"action",    x:1530, y:520,
    info:"GET txtMinutos → new Parquimetro() → Calcular() → ViewBag.resultado → View(\"Ejercicio1\")",
    code:"IActionResult CalcularParquimetro(string txtMinutos)" },
  { id:"a_ej2",   label:"Ejercicio2()",             group:"action",    x:1770, y:520,
    info:"GET → View() → Ejercicio2.cshtml vacío.", code:"public IActionResult Ejercicio2() => View();" },
  { id:"a_cvel",  label:"Calcular\nVelocidad()",    group:"action",    x:2010, y:520,
    info:"GET 5 params → new Recorrido() → CalcularVelocidad() → Math.Round → ViewBag → View(\"Ejercicio2\")",
    code:"IActionResult CalcularVelocidad(txtHoras,txtMinutos,txtSegundos,txtCentesimas,txtDistancia)" },
  { id:"a_ej3",   label:"Ejercicio3()",             group:"action",    x:2250, y:520,
    info:"GET → ViewBag.respuesta = listado → View(\"Ejercicio3\")",
    code:"ViewBag.respuesta = listado; return View();" },
  { id:"a_ctri",  label:"Calcular\nTriplicar()",    group:"action",    x:2490, y:520,
    info:"GET txtNumero → new Registro() → Calcular() → listado.Add() → ViewBag.respuesta",
    code:"IActionResult CalcularTriplicar(string txtNumero)" },
  { id:"vb1",     label:"ViewBag\n.resultado (1)",  group:"vbag",      x:1390, y:730,
    info:"Cobro CLP = parquimetro.Calcular(). Leído con @ViewBag.resultado en Ejercicio1.cshtml.",
    code:"ViewBag.resultado = parquimetro.Calcular();\nViewBag.minutos = parquimetro.minutos;" },
  { id:"vb2",     label:"ViewBag\n.resultado (2)",  group:"vbag",      x:1870, y:730,
    info:"Velocidad = Math.Round(recorrido.CalcularVelocidad(),2) km/hr.",
    code:"ViewBag.resultado = Math.Round(recorrido.CalcularVelocidad(), 2);" },
  { id:"vb3",     label:"ViewBag\n.respuesta (3)",  group:"vbag",      x:2370, y:730,
    info:"List<Registro> completa. Leída en @foreach de Ejercicio3.cshtml.",
    code:"ViewBag.respuesta = listado;" },
  { id:"vb_err",  label:"ViewBag\n.error (3)",      group:"vbag",      x:2590, y:730,
    info:"Mensaje de error si txtNumero es null.",
    code:'ViewBag.error = "Debe ingresar un número";' },
  { id:"m_pq",    label:"Parquimetro",              group:"model",     x:790,  y:940,
    info:"Modelo Ej1. valorBase=1850, valorMinuto=23. Retorna cobro int.",
    code:"public class Parquimetro { ... }" },
  { id:"p_vb",    label:"valorBase\n=1850",         group:"prop",      x:510,  y:1160,
    info:"Tarifa base: primeros 25 minutos = $1850.", code:"public int valorBase { get; set; } = 1850;" },
  { id:"p_vm",    label:"valorMinuto\n=23",         group:"prop",      x:700,  y:1260,
    info:"Valor por cada minuto adicional sobre 25.", code:"public int valorMinuto { get; set; } = 23;" },
  { id:"p_m1",    label:"minutos",                  group:"prop",      x:900,  y:1260,
    info:"Minutos estacionado. Asignado desde el controlador.", code:"public int minutos { get; set; } = 0;" },
  { id:"f_cpq",   label:"Calcular()\n→int",         group:"func",      x:680,  y:1140,
    info:"if minutos<=25: return valorBase\nelse: return valorBase+((minutos-25)*valorMinuto)",
    code:"public int Calcular(){\n  if(minutos<=25) return valorBase;\n  return valorBase+((minutos-25)*valorMinuto);\n}" },
  { id:"m_rc",    label:"Recorrido",                group:"model",     x:1810, y:940,
    info:"Modelo Ej2. Calcula velocidad promedio en km/hr.",
    code:"public class Recorrido { ... }" },
  { id:"p_hr",    label:"horas",     group:"prop",  x:1390, y:1165, info:"Horas del tiempo total.",  code:"public double horas { get; set; } = 0;" },
  { id:"p_m2",    label:"minutos",   group:"prop",  x:1580, y:1270, info:"Minutos del tiempo.",      code:"public double minutos { get; set; } = 0;" },
  { id:"p_sg",    label:"segundos",  group:"prop",  x:1810, y:1320, info:"Segundos del tiempo.",     code:"public double segundos { get; set; } = 0;" },
  { id:"p_cn",    label:"centesimas",group:"prop",  x:2040, y:1270, info:"Centésimas de segundo.",   code:"public double centesimas { get; set; } = 0;" },
  { id:"p_ds",    label:"distancia\n(m)",group:"prop",x:2150,y:1165,info:"Distancia en metros.",    code:"public double distancia { get; set; } = 0;" },
  { id:"f_cv",    label:"Calcular\nVelocidad()\n→double", group:"func", x:1810, y:1145,
    info:"totalHoras=h+min/60+seg/3600+cen/360000\ndistKm=distancia/1000\nreturn distKm/totalHoras",
    code:"public double CalcularVelocidad(){\n  double th=horas+(minutos/60)+(segundos/3600)+(centesimas/360000);\n  return (distancia/1000)/th;\n}" },
  { id:"m_rg",    label:"Registro",                 group:"model",     x:2830, y:940,
    info:"Modelo Ej3. Almacena numero, total, mensaje. Se acumula en lista estática.",
    code:"public class Registro { ... }" },
  { id:"p_nu",    label:"numero",    group:"prop",  x:2630, y:1160, info:"Número ingresado.", code:"public double numero { get; set; } = 0;" },
  { id:"p_to",    label:"total",     group:"prop",  x:2830, y:1270, info:"Resultado (×3 o ÷4).", code:"public double total { get; set; } = 0;" },
  { id:"p_ms",    label:"mensaje",   group:"prop",  x:3030, y:1160, info:'"Menor a 50" o "Mayor o igual a 50".', code:"public string? mensaje { get; set; }" },
  { id:"f_ct",    label:"Calcular()\n→void",        group:"func",      x:2930, y:1060,
    info:"if numero<50: total=numero*3, mensaje=\"Menor a 50\"\nelse: total=numero/4, mensaje=\"Mayor o igual a 50\"",
    code:"public void Calcular(){\n  if(numero<50){total=numero*3; mensaje=\"Menor a 50\";}\n  else{total=numero/4; mensaje=\"Mayor o igual a 50\";}\n}" },
  { id:"v_idx",   label:"Index\n.cshtml",           group:"view",      x:1050, y:310,
    info:"Vista principal. Renderizada por Index().", code:'asp-action="Index"' },
  { id:"v_ej1",   label:"Ejercicio1\n.cshtml",      group:"view",      x:530,  y:665,
    info:"Form POST → CalcularParquimetro. Muestra @ViewBag.resultado.",
    code:'<form asp-action="CalcularParquimetro">\n  <input name="txtMinutos"/>\n</form>\n@ViewBag.resultado' },
  { id:"v_ej2",   label:"Ejercicio2\n.cshtml",      group:"view",      x:1060, y:840,
    info:"5 inputs → CalcularVelocidad. Muestra @ViewBag.resultado km/hr.",
    code:'<form asp-action="CalcularVelocidad">\n  txtHoras,txtMinutos,txtSegundos,\n  txtCentesimas,txtDistancia\n</form>' },
  { id:"v_ej3",   label:"Ejercicio3\n.cshtml",      group:"view",      x:3130, y:665,
    info:"Input txtNumero → CalcularTriplicar. Grilla @foreach ViewBag.respuesta.",
    code:"<table>\n@foreach(var item in ViewBag.respuesta){...}\n</table>" },
  { id:"i_m1",    label:"txtMinutos",               group:"input",     x:350,  y:865,
    info:"Input Ej1 → POST a CalcularParquimetro.", code:'<input type="number" name="txtMinutos"/>' },
  { id:"i_hr",    label:"txtHoras",    group:"input", x:670,  y:985, info:"Input horas Ej2.", code:'<input name="txtHoras"/>' },
  { id:"i_mn",    label:"txtMinutos\n(Ej2)",group:"input",x:850, y:1055,info:"Input minutos Ej2.", code:'<input name="txtMinutos"/>' },
  { id:"i_sg",    label:"txtSegundos", group:"input", x:1030, y:1055,info:"Input segundos Ej2.", code:'<input name="txtSegundos"/>' },
  { id:"i_cn",    label:"txtCentesimas",group:"input",x:1210, y:985, info:"Input centésimas Ej2.", code:'<input name="txtCentesimas"/>' },
  { id:"i_ds",    label:"txtDistancia",group:"input", x:1390, y:985, info:"Input distancia Ej2.", code:'<input name="txtDistancia"/>' },
  { id:"i_nu",    label:"txtNumero",   group:"input", x:3340, y:865, info:"Input Ej3 → POST a CalcularTriplicar.", code:'<input type="number" name="txtNumero"/>' },
];

const EDGES = [
  {s:"layout",t:"v_idx", type:"wraps",  lb:"@RenderBody"},{s:"layout",t:"v_ej1",type:"wraps",lb:"@RenderBody"},
  {s:"layout",t:"v_ej2", type:"wraps",  lb:"@RenderBody"},{s:"layout",t:"v_ej3",type:"wraps",lb:"@RenderBody"},
  {s:"layout",t:"a_idx", type:"sends",  lb:"nav link"},   {s:"layout",t:"a_ej1",type:"sends",lb:"nav link"},
  {s:"layout",t:"a_ej2", type:"sends",  lb:"nav link"},   {s:"layout",t:"a_ej3",type:"sends",lb:"nav link"},
  {s:"hc",t:"hc_list",type:"owns",lb:"static"},{s:"hc",t:"a_idx",type:"owns",lb:"acción"},
  {s:"hc",t:"a_ej1",type:"owns",lb:"acción"},{s:"hc",t:"a_cpar",type:"owns",lb:"acción"},
  {s:"hc",t:"a_ej2",type:"owns",lb:"acción"},{s:"hc",t:"a_cvel",type:"owns",lb:"acción"},
  {s:"hc",t:"a_ej3",type:"owns",lb:"acción"},{s:"hc",t:"a_ctri",type:"owns",lb:"acción"},
  {s:"a_idx",t:"v_idx",type:"renders",lb:"View()"},{s:"a_ej1",t:"v_ej1",type:"renders",lb:"View()"},
  {s:"a_cpar",t:"v_ej1",type:"renders",lb:'View("Ejercicio1")'},{s:"a_ej2",t:"v_ej2",type:"renders",lb:"View()"},
  {s:"a_cvel",t:"v_ej2",type:"renders",lb:'View("Ejercicio2")'},{s:"a_ej3",t:"v_ej3",type:"renders",lb:"View()"},
  {s:"a_ctri",t:"v_ej3",type:"renders",lb:'View("Ejercicio3")'},
  {s:"a_cpar",t:"m_pq",type:"uses",lb:"new Parquimetro()"},{s:"a_cvel",t:"m_rc",type:"uses",lb:"new Recorrido()"},
  {s:"a_ctri",t:"m_rg",type:"uses",lb:"new Registro()"},
  {s:"a_cpar",t:"f_cpq",type:"call",lb:"Calcular()"},{s:"a_cvel",t:"f_cv",type:"call",lb:"CalcularVelocidad()"},
  {s:"a_ctri",t:"f_ct",type:"call",lb:"Calcular()"},
  {s:"a_cpar",t:"vb1",type:"sets",lb:"ViewBag.resultado"},{s:"a_cvel",t:"vb2",type:"sets",lb:"ViewBag.resultado"},
  {s:"a_ej3",t:"vb3",type:"sets",lb:"ViewBag.respuesta"},{s:"a_ctri",t:"vb3",type:"sets",lb:"ViewBag.respuesta"},
  {s:"a_ctri",t:"vb_err",type:"sets",lb:"ViewBag.error"},
  {s:"a_ctri",t:"hc_list",type:"uses",lb:"listado.Add()"},{s:"a_ej3",t:"hc_list",type:"reads",lb:"listado"},
  {s:"vb1",t:"v_ej1",type:"reads",lb:"@ViewBag.resultado"},{s:"vb2",t:"v_ej2",type:"reads",lb:"@ViewBag.resultado"},
  {s:"vb3",t:"v_ej3",type:"reads",lb:"@ViewBag.respuesta"},{s:"vb_err",t:"v_ej3",type:"reads",lb:"@ViewBag.error"},
  {s:"m_pq",t:"p_vb",type:"owns",lb:"prop"},{s:"m_pq",t:"p_vm",type:"owns",lb:"prop"},
  {s:"m_pq",t:"p_m1",type:"owns",lb:"prop"},{s:"m_pq",t:"f_cpq",type:"owns",lb:"método"},
  {s:"m_rc",t:"p_hr",type:"owns",lb:"prop"},{s:"m_rc",t:"p_m2",type:"owns",lb:"prop"},
  {s:"m_rc",t:"p_sg",type:"owns",lb:"prop"},{s:"m_rc",t:"p_cn",type:"owns",lb:"prop"},
  {s:"m_rc",t:"p_ds",type:"owns",lb:"prop"},{s:"m_rc",t:"f_cv",type:"owns",lb:"método"},
  {s:"m_rg",t:"p_nu",type:"owns",lb:"prop"},{s:"m_rg",t:"p_to",type:"owns",lb:"prop"},
  {s:"m_rg",t:"p_ms",type:"owns",lb:"prop"},{s:"m_rg",t:"f_ct",type:"owns",lb:"método"},
  {s:"f_cpq",t:"p_vb",type:"reads",lb:"valorBase"},{s:"f_cpq",t:"p_vm",type:"reads",lb:"valorMinuto"},
  {s:"f_cpq",t:"p_m1",type:"reads",lb:"minutos"},
  {s:"f_cv",t:"p_hr",type:"reads",lb:"horas"},{s:"f_cv",t:"p_m2",type:"reads",lb:"minutos"},
  {s:"f_cv",t:"p_sg",type:"reads",lb:"segundos"},{s:"f_cv",t:"p_cn",type:"reads",lb:"centesimas"},
  {s:"f_cv",t:"p_ds",type:"reads",lb:"distancia"},
  {s:"f_ct",t:"p_nu",type:"reads",lb:"numero"},{s:"f_ct",t:"p_to",type:"sets",lb:"total"},
  {s:"f_ct",t:"p_ms",type:"sets",lb:"mensaje"},
  {s:"v_ej1",t:"i_m1",type:"owns",lb:"input"},{s:"v_ej2",t:"i_hr",type:"owns",lb:"input"},
  {s:"v_ej2",t:"i_mn",type:"owns",lb:"input"},{s:"v_ej2",t:"i_sg",type:"owns",lb:"input"},
  {s:"v_ej2",t:"i_cn",type:"owns",lb:"input"},{s:"v_ej2",t:"i_ds",type:"owns",lb:"input"},
  {s:"v_ej3",t:"i_nu",type:"owns",lb:"input"},
  {s:"i_m1",t:"a_cpar",type:"sends",lb:"POST txtMinutos"},
  {s:"i_hr",t:"a_cvel",type:"sends",lb:"POST txtHoras"},{s:"i_mn",t:"a_cvel",type:"sends",lb:"POST txtMinutos"},
  {s:"i_sg",t:"a_cvel",type:"sends",lb:"POST txtSegundos"},{s:"i_cn",t:"a_cvel",type:"sends",lb:"POST txtCentesimas"},
  {s:"i_ds",t:"a_cvel",type:"sends",lb:"POST txtDistancia"},{s:"i_nu",t:"a_ctri",type:"sends",lb:"POST txtNumero"},
  {s:"a_cpar",t:"p_m1",type:"sets",lb:"parquimetro.minutos="},
  {s:"a_cvel",t:"p_hr",type:"sets",lb:"recorrido.horas="},{s:"a_cvel",t:"p_m2",type:"sets",lb:"recorrido.minutos="},
  {s:"a_cvel",t:"p_sg",type:"sets",lb:"recorrido.segundos="},{s:"a_cvel",t:"p_cn",type:"sets",lb:"recorrido.centesimas="},
  {s:"a_cvel",t:"p_ds",type:"sets",lb:"recorrido.distancia="},{s:"a_ctri",t:"p_nu",type:"sets",lb:"registro.numero="},
];

const GRP = {
  ctrl:   { fill:"#1a2f60", stroke:"#388bfd", r:38, tc:"#79c0ff" },
  action: { fill:"#0e1e40", stroke:"#1f6feb", r:27, tc:"#58a6ff" },
  model:  { fill:"#0d2010", stroke:"#2ea043", r:33, tc:"#56d364" },
  prop:   { fill:"#071509", stroke:"#238636", r:21, tc:"#3fb950" },
  func:   { fill:"#071015", stroke:"#1f6feb", r:25, tc:"#79c0ff" },
  view:   { fill:"#221800", stroke:"#bb8009", r:30, tc:"#e3b341" },
  input:  { fill:"#181200", stroke:"#7d6514", r:19, tc:"#d29922" },
  vbag:   { fill:"#160b2e", stroke:"#6e40c9", r:24, tc:"#bc8cff" },
  layout: { fill:"#161b22", stroke:"#8b949e", r:34, tc:"#c9d1d9" },
};
const EC = {
  call:"#ff7b72", sets:"#bc8cff", reads:"#58a6ff", renders:"#d29922",
  sends:"#3fb950", wraps:"#555", owns:"#2d3748", uses:"#1f6feb",
};

const nmap = {};
NODES.forEach(n => nmap[n.id] = n);

// ── Componente principal ──────────────────────────────────────────────────
export default function MapaMVC() {
  const svgRef = useRef(null);
  const [cam, setCam] = useState({ x: 0, y: 0, sc: 1 });
  const [nodePos, setNodePos] = useState(() => {
    const p = {};
    NODES.forEach(n => { p[n.id] = { x: n.x, y: n.y }; });
    return p;
  });
  const [hov, setHov] = useState(null);
  const [pin, setPin] = useState(null);
  const [showLbl, setShowLbl] = useState(true);
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 1200, h: 700 });

  const dragRef = useRef({ type: null, id: null, ox: 0, oy: 0, cx: 0, cy: 0 });

  // Medir contenedor
  const wrapRef = useRef(null);
  useEffect(() => {
    const obs = new ResizeObserver(es => {
      const e = es[0].contentRect;
      setSize({ w: e.width, h: e.height });
    });
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  // Auto-fit al montar
  useEffect(() => {
    if (!size.w || !size.h) return;
    fitAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, size.h]);

  function fitAll() {
    let x0=1e9, y0=1e9, x1=-1e9, y1=-1e9;
    NODES.forEach(n => {
      const g = GRP[n.group] || GRP.prop;
      x0 = Math.min(x0, n.x - g.r); y0 = Math.min(y0, n.y - g.r);
      x1 = Math.max(x1, n.x + g.r); y1 = Math.max(y1, n.y + g.r);
    });
    const pad = 48;
    const sc = Math.min((size.w - pad*2) / (x1-x0), (size.h - pad*2) / (y1-y0), 1.2);
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    setCam({ x: size.w/2 - cx*sc, y: size.h/2 - cy*sc, sc });
  }

  // ── Eventos de puntero ──────────────────────────────────────────────────
  function svgCoord(e) {
    const rect = svgRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  function toWorld(sx, sy) {
    return { x: (sx - cam.x) / cam.sc, y: (sy - cam.y) / cam.sc };
  }

  function onPointerDown(e, nodeId) {
    e.stopPropagation();
    const sc = svgCoord(e);
    dragRef.current = { type: "node", id: nodeId, ox: sc.x, oy: sc.y,
      nx: nodePos[nodeId].x, ny: nodePos[nodeId].y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onSvgDown(e) {
    const sc = svgCoord(e);
    dragRef.current = { type: "pan", ox: sc.x, oy: sc.y, cx: cam.x, cy: cam.y };
  }

  function onPointerMove(e) {
    const d = dragRef.current;
    if (!d.type) return;
    const sc = svgCoord(e);
    if (d.type === "node") {
      const dx = (sc.x - d.ox) / cam.sc;
      const dy = (sc.y - d.oy) / cam.sc;
      setNodePos(p => ({ ...p, [d.id]: { x: d.nx + dx, y: d.ny + dy } }));
    } else if (d.type === "pan") {
      setCam(c => ({ ...c, x: d.cx + (sc.x - d.ox), y: d.cy + (sc.y - d.oy) }));
    }
  }

  function onPointerUp(e) {
    dragRef.current = { type: null };
  }

  function onWheel(e) {
    e.preventDefault();
    const sc = svgCoord(e);
    const f = e.deltaY < 0 ? 1.13 : 0.88;
    const wx = (sc.x - cam.x) / cam.sc;
    const wy = (sc.y - cam.y) / cam.sc;
    setCam(c => {
      const ns = Math.max(0.05, Math.min(4, c.sc * f));
      return { x: sc.x - wx * ns, y: sc.y - wy * ns, sc: ns };
    });
  }

  function onNodeClick(e, n) {
    e.stopPropagation();
    const sc = svgCoord(e);
    setTipPos({ x: sc.x + 14, y: sc.y - 20 });
    setPin(p => p?.id === n.id ? null : n);
  }

  function onNodeHover(n) { setHov(n); }
  function onNodeLeave()  { setHov(null); }

  const active = pin || hov;

  // ── Render aristas ───────────────────────────────────────────────────────
  function renderEdges() {
    return EDGES.map((e, i) => {
      const a = nmap[e.s], b = nmap[e.t];
      if (!a || !b) return null;
      const pa = nodePos[a.id] || { x: a.x, y: a.y };
      const pb = nodePos[b.id] || { x: b.x, y: b.y };
      const ga = GRP[a.group] || GRP.prop, gb = GRP[b.group] || GRP.prop;
      const dx = pb.x - pa.x, dy = pb.y - pa.y;
      const L = Math.sqrt(dx*dx + dy*dy); if (L < 1) return null;
      const ux = dx/L, uy = dy/L;
      const x1 = pa.x + ux*ga.r, y1 = pa.y + uy*ga.r;
      const x2 = pb.x - ux*(gb.r+1), y2 = pb.y - uy*(gb.r+1);
      const c = EC[e.type] || "#555";
      const ar = 7;
      const ax1 = x2 - ar*(ux + uy*.5), ay1 = y2 - ar*(uy - ux*.5);
      const ax2 = x2 - ar*(ux - uy*.5), ay2 = y2 - ar*(uy + ux*.5);
      const isHi = active && (e.s === active.id || e.t === active.id);
      const isDash = e.type === "owns" || e.type === "wraps";
      const alpha = active ? (isHi ? 1 : 0.07) : 0.45;
      const mx = (x1+x2)/2, my = (y1+y2)/2;
      return (
        <g key={i} opacity={alpha}>
          <line x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={c} strokeWidth={1.2}
            strokeDasharray={isDash ? "6,4" : "none"} />
          <polygon points={`${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`} fill={c} />
          {isHi && showLbl && (
            <g>
              <rect x={mx - e.lb.length*3.1} y={my-7} width={e.lb.length*6.2} height={13}
                fill="#0d1117cc" rx={2} />
              <text x={mx} y={my+4} textAnchor="middle" fontSize={9}
                fill={c} fontFamily="Courier New">{e.lb}</text>
            </g>
          )}
        </g>
      );
    });
  }

  // ── Render nodos ─────────────────────────────────────────────────────────
  function renderNodes() {
    return NODES.map(n => {
      const g = GRP[n.group] || GRP.prop;
      const p = nodePos[n.id] || { x: n.x, y: n.y };
      const isHi = active && n.id === active.id;
      const dim  = active && !isHi;
      const lines = n.label.split("\n");
      const fs = Math.max(6, Math.min(12, g.r * 0.28));
      const lh = fs * 1.3;
      return (
        <g key={n.id} transform={`translate(${p.x},${p.y})`}
          style={{ cursor: "pointer" }}
          opacity={dim ? 0.22 : 1}
          onPointerDown={e => onPointerDown(e, n.id)}
          onClick={e => onNodeClick(e, n)}
          onMouseEnter={() => onNodeHover(n)}
          onMouseLeave={onNodeLeave}>
          {isHi && <circle r={g.r + 5} fill="none" stroke={g.stroke}
            strokeWidth={1.5} opacity={0.5}
            style={{ filter: `drop-shadow(0 0 8px ${g.stroke})` }} />}
          <circle r={g.r} fill={g.fill} stroke={isHi ? "#fff" : g.stroke}
            strokeWidth={isHi ? 2.2 : 1.4}
            style={isHi ? { filter: `drop-shadow(0 0 10px ${g.stroke})` } : {}} />
          {showLbl && lines.map((l, i) => (
            <text key={i} x={0} y={(-(lines.length-1)/2 + i) * lh + fs/3}
              textAnchor="middle" fontSize={fs} fill={g.tc}
              fontFamily="Courier New" fontWeight="bold">{l}</text>
          ))}
        </g>
      );
    });
  }

  // ── Tooltip ───────────────────────────────────────────────────────────────
  const tipNode = pin;
  const TIP_W = 290;
  const tx = Math.min(tipPos.x, size.w - TIP_W - 8);
  const ty = Math.max(tipPos.y, 8);

  return (
    <div ref={wrapRef} style={{ width:"100%", height:"100vh", background:"#0d1117",
      display:"flex", flexDirection:"column", fontFamily:"'Courier New',monospace",
      userSelect:"none", overflow:"hidden" }}>

      {/* Toolbar */}
      <div style={{ height:44, background:"#161b22", borderBottom:"1px solid #30363d",
        display:"flex", alignItems:"center", gap:10, padding:"0 14px", flexShrink:0, flexWrap:"wrap" }}>
        <span style={{ color:"#58a6ff", fontWeight:700, fontSize:13 }}>🗺 Mapa MVC — PW_Ejercicios</span>
        <span style={{ color:"#8b949e", fontSize:10 }}>nacho · seba · janvera</span>
        <button onClick={() => { setPin(null); setHov(null); fitAll(); }}
          style={{ padding:"3px 10px", borderRadius:6, border:"1px solid #30363d",
            background:"#21262d", color:"#e6edf3", fontSize:11, cursor:"pointer" }}>
          Reset vista
        </button>
        <button onClick={() => setShowLbl(v => !v)}
          style={{ padding:"3px 10px", borderRadius:6, border:"1px solid #30363d",
            background:"#21262d", color:"#e6edf3", fontSize:11, cursor:"pointer" }}>
          {showLbl ? "Ocultar" : "Mostrar"} etiquetas
        </button>
        <div style={{ display:"flex", gap:8, marginLeft:"auto", flexWrap:"wrap" }}>
          {[["#388bfd","Controlador/Acción"],["#3fb950","Modelo/Prop/Método"],
            ["#d29922","Vista/Input"],["#bc8cff","ViewBag"],["#8b949e","Layout"]].map(([c,l])=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:4, fontSize:9, color:"#8b949e" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:c }} />{l}
            </div>
          ))}
        </div>
      </div>

      {/* SVG canvas */}
      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
        <svg ref={svgRef} width={size.w} height={size.h}
          style={{ display:"block", background:"#0d1117", cursor:"grab" }}
          onPointerDown={onSvgDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onWheel={onWheel}>

          {/* Grid */}
          <defs>
            <pattern id="grid" width={100*cam.sc} height={100*cam.sc}
              x={cam.x % (100*cam.sc)} y={cam.y % (100*cam.sc)}
              patternUnits="userSpaceOnUse">
              <path d={`M ${100*cam.sc} 0 L 0 0 0 ${100*cam.sc}`}
                fill="none" stroke="#161b22" strokeWidth={0.5} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <g transform={`translate(${cam.x},${cam.y}) scale(${cam.sc})`}>
            {renderEdges()}
            {renderNodes()}
          </g>
        </svg>

        {/* Tooltip fijo */}
        {tipNode && (
          <div style={{
            position:"absolute", left: tx, top: ty,
            background:"#161b22", border:"1px solid #30363d",
            borderRadius:8, padding:"10px 13px", width: TIP_W,
            fontSize:11, color:"#e6edf3", lineHeight:1.55,
            boxShadow:"0 8px 28px #000000b0", zIndex:200, pointerEvents:"none"
          }}>
            <div style={{ fontWeight:700, fontSize:12, color:"#fff", marginBottom:3 }}>
              {tipNode.label.replace(/\n/g," ")}
            </div>
            <div style={{ fontSize:9, color:"#8b949e", marginBottom:6 }}>
              [{tipNode.group}] · id: {tipNode.id}
            </div>
            <pre style={{ fontSize:9, color:"#8b949e", whiteSpace:"pre-wrap",
              marginBottom:6, background:"#0d1117", padding:"6px 8px", borderRadius:5,
              border:"1px solid #30363d" }}>
              {tipNode.code}
            </pre>
            <div style={{ fontSize:10, color:"#c9d1d9", marginBottom:6 }}>{tipNode.info}</div>
            <div style={{ fontSize:9, color:"#58a6ff", whiteSpace:"pre-wrap" }}>
              {EDGES.filter(e=>e.s===tipNode.id||e.t===tipNode.id)
                .map(e=>`${e.type.padEnd(8)} ${e.s}→${e.t}  (${e.lb})`)
                .join("\n")}
            </div>
            <div style={{ marginTop:6, fontSize:9, color:"#484f58" }}>Click nodo de nuevo para cerrar</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ height:24, background:"#161b22", borderTop:"1px solid #30363d",
        display:"flex", alignItems:"center", padding:"0 12px", gap:12,
        fontSize:9, color:"#8b949e", flexShrink:0 }}>
        <span>🖱 Drag fondo=mover · Rueda=zoom · Drag nodo=reposicionar · Click nodo=info</span>
        <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
          {Object.entries(EC).map(([t,c]) => (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:3 }}>
              <div style={{ width:14, height:2, background:c }} />{t}
            </div>
          ))}
        </div>
        <span style={{ marginLeft:8 }}>nodos: {NODES.length} | aristas: {EDGES.length}</span>
      </div>
    </div>
  );
}
