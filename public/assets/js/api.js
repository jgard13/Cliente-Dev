const API_URL = "/Cliente-Dev/api/"; // <-- si tu carpeta en htdocs se llama Cliente-Dev

const API = {
    login: (data) => fetch(API_URL + "login.php", {
        method: "POST",
        body: new URLSearchParams(data)
    }).then(r => r.json()),

    register: (data) => fetch(API_URL + "register.php", {
        method: "POST",
        body: new URLSearchParams(data)
    }).then(r => r.json()),

    materias: () => fetch(API_URL + "get_materias.php").then(r => r.json()),

    calificaciones: (id) =>
        fetch(API_URL + `get_calificaciones.php?id_user=${id}`)
        .then(r => r.json()),

    addCal: (data) => fetch(API_URL + "add_calificacion.php", {
        method: "POST",
        body: new URLSearchParams(data)
    }).then(r => r.json()),

    updateCal: (data) => fetch(API_URL + "update_calificacion.php", {
        method: "POST",
        body: new URLSearchParams(data)
    }).then(r => r.json()),

    deleteCal: (data) => fetch(API_URL + "delete_calificacion.php", {
        method: "POST",
        body: new URLSearchParams(data)
    }).then(r => r.json()),

    calcularMinimo: (p1, p2, tipo) => fetch(API_URL + "calcular_minimo.php", {
        method: "POST",
        body: new URLSearchParams({ p1, p2, tipo })
    }).then(r => r.json()),

    calcularFinal: (data) => fetch(API_URL + "calcular_final.php", {
        method: "POST",
        body: new URLSearchParams(data)
    }).then(r => r.json())
};
