// LOGIN
document.getElementById("btnLogin").addEventListener("click", async () => {
    const username = document.getElementById("Usuario").value;
    const password = document.getElementById("Contraseña").value;

    const res = await API.login({ username, password });

    if (!res.success) {
        alert(res.msg || "Error al iniciar sesión");
        return;
    }

    localStorage.setItem("id_user", res.id_user);
    location.href = "ver-calificaciones.html";
});

// REGISTRO
document.querySelector("#Registro .btn").addEventListener("click", async () => {
    const usuario = document.getElementById("UsuarioRegistro").value;
    const pass = document.getElementById("ContraseñaRegistro").value;
    const correo = document.getElementById("Email").value;

    const res = await API.register({ usuario, pass, correo });

    if (res.error) {
        alert(res.error);
        return;
    }

    alert(res.msg);
    // opcional: limpiar formulario
    document.getElementById("UsuarioRegistro").value = "";
    document.getElementById("ContraseñaRegistro").value = "";
    document.getElementById("Email").value = "";
});
