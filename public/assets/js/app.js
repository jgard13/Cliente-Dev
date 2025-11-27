(async () => {
  function q(id){ return document.getElementById(id); }
  function escapeHtml(str){ if (str==null) return ''; return String(str).replace(/[&<>"'`=\/]/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'})[s]); }

  async function cargarCalificaciones() {
    const id_user = localStorage.getItem('id_user') || 0;
    const res = await API.calificaciones(id_user);
    let datos = [];
    if (res && res.success && Array.isArray(res.data)) datos = res.data;
    else if (Array.isArray(res)) datos = res;
    const cont = q('calificacionesContainer');
    if (!cont) return;
    cont.innerHTML = '';
    const frag = document.createDocumentFragment();

    for (let item of datos) {
      const p1 = parseFloat(item.Cal_PrimerParcial) || 0;
      const p2 = parseFloat(item.Cal_SegundoParcial) || 0;
      const tipo = item.TipoPonderacion || item.TipoPonderacion || 'C';
      const calcRes = await API.calcularMinimo(p1, p2, tipo);
      const p3_min = (calcRes && calcRes.p3_minimo != null) ? calcRes.p3_minimo : '—';
      const imposible = calcRes && calcRes.imposible;

      let colorClass = 'status-green';
      if (imposible) colorClass = 'status-black';
      else if (p3_min > 85 && p3_min <= 100) colorClass = 'status-red';
      else if (p3_min > 70 && p3_min <= 85) colorClass = 'status-yellow';
      else colorClass = 'status-green';

      const card = document.createElement('div');
      card.className = 'calificacion-card';
      card.dataset.usuario = item.Usuario;
      card.dataset.materia = item.Materia;

      card.innerHTML = `
        <div class="card-header">
            <div>${escapeHtml(item.NombreMateria)}</div>
            <div class="text-center">P1</div>
            <div class="text-center">P2</div>
            <div class="text-center">P3</div>
            <div class="text-center">CALIF.<br>NECESITADA</div>
            <div></div>
        </div>
        <div class="card-body">
            <div>Ponderación: ${escapeHtml(item.TipoPonderacion)}</div>
            <div class="text-center">${escapeHtml(item.Cal_PrimerParcial)}</div>
            <div class="text-center">${escapeHtml(item.Cal_SegundoParcial)}</div>
            <div class="text-center">${escapeHtml(item.Cal_TercerParcial)}</div>
            <div class="text-center">
                <div class="calif-box">
                    <div class="calif-box-value">${imposible ? 'IMPOSIBLE' : p3_min}</div>
                </div>
            </div>
            <div>
                <div class="status-bar ${colorClass}"></div>
                <div style="text-align:center;margin-top:6px;">
                  <button class="btn btn-sm btn-outline-primary btn-edit" data-usuario="${item.Usuario}" data-materia="${item.Materia}">Editar</button>
                  <i class="bi bi-trash delete-icon" 
                    data-usuario="${item.Usuario}" 
                    data-materia="${item.Materia}">
                  </i>
                </div>
            </div>
        </div>
      `;
      frag.appendChild(card);
    }

    cont.appendChild(frag);

    cont.querySelectorAll('.delete-icon').forEach(icon => {
      icon.addEventListener('click', async (e) => {
        e.stopPropagation();
        const usuario = icon.dataset.usuario;
        const materia = icon.dataset.materia;
        if (!confirm('Eliminar registro?')) return;
        const resDel = await API.deleteCal({ id_user: usuario, materia: materia });
        if (resDel && resDel.success) {
          alert('Eliminado');
          cargarCalificaciones();
        } else {
          alert('Error al eliminar: ' + (resDel.message || JSON.stringify(resDel)));
        }
      });
    });


    cont.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const usuario = btn.dataset.usuario;
        const materia = btn.dataset.materia;

        // REDIRECCIÓN A LA VISTA DE EDICIÓN
        window.location.href = `modificar-calificaciones.html?id_user=${usuario}&id_materia=${materia}`;
      });
    });


  }

  async function setupAgregar() {
    const select = q('materiaSelect');
    const p1Input = q('p1Input');
    const p2Input = q('p2Input');
    const p3Input = q('p3Input');
    const btnAceptar = q('btnAceptar');
    if (!select) return;
    const mm = await API.materias();
    const materias = mm && mm.data ? mm.data : (Array.isArray(mm) ? mm : []);
    select.innerHTML = '<option value="">...</option>';
    materias.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id_materia;
      opt.dataset.tipo = m.TipoPonderacion;
      opt.textContent = `${m.NombreMateria} (${m.TipoPonderacion})`;
      select.appendChild(opt);
    });

    btnAceptar.addEventListener('click', async (e) => {
      e.preventDefault();
      const materia = parseInt(select.value);
      const p1 = parseFloat(p1Input.value) || 0;
      const p2 = parseFloat(p2Input.value) || 0;
      const p3 = parseFloat(p3Input.value) || 0;
      if (!materia) return alert('Selecciona una materia');
      for (const v of [p1,p2,p3]) if (isNaN(v) || v < 0 || v > 100) return alert('Parciales entre 0 y 100');
      let usuario = parseInt(localStorage.getItem('id_user') || 0);
      if (!usuario) return alert('Usuario no identificado. Inicia sesión.');
      usuario = parseInt(usuario);

      const tipo = select.options[select.selectedIndex].dataset.tipo || 'C';
      const calc = await API.calcularMinimo(p1, p2, tipo);
      if (!(calc && calc.success)) {
        if (calc && calc.message) alert('Error: ' + calc.message);
        else alert('Error calculando');
        return;
      }
      if (!confirm(`La calificación final requiere ${calc.p3_minimo}. Guardar?`)) return;

      const addRes = await API.addCal({ id_user: usuario, id_materia: materia, p1, p2, p3 });
      if (addRes && addRes.success) {
        alert('Guardado con éxito');
        p1Input.value = p2Input.value = p3Input.value = '';
        select.value = '';
      } else {
        alert('Error guardando: ' + (addRes.message || JSON.stringify(addRes)));
      }
    });
  }

  function inicializar() {
    const path = window.location.pathname;
    if (path.includes('ver-calificaciones.html')) cargarCalificaciones();
    if (path.includes('agregar-calificacion.html')) setupAgregar();
  }

  document.addEventListener('DOMContentLoaded', inicializar);

  const btnAgregar = document.getElementById('btnAgregarCalificacion');
  if (btnAgregar) {
      btnAgregar.addEventListener('click', () => {
          window.location.href = 'agregar-calificacion.html';
      });
  }

  const btnVer = document.getElementById('btnVerCalificacion');
  if (btnVer) {
      btnVer.addEventListener('click', () => {
          window.location.href = 'ver-calificaciones.html';
      });
  }


})();
