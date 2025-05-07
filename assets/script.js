

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('comentarioForm');
        const mensajesDiv = document.getElementById('mensajes');
      
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const nombre = document.getElementById('nombre').value;
          const mensaje = document.getElementById('mensaje').value;
      
          await fetch('http://localhost:3000/nuevo-mensaje', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, mensaje })
          });
      
          form.reset();
          cargarMensajes();
        });
      
        async function cargarMensajes() {
          const res = await fetch('http://localhost:3000/mensajes');
          const mensajes = await res.json();
          mensajesDiv.innerHTML = mensajes.map(m =>
            `<p><strong>${m.nombre}</strong> escribió el ${new Date(m.fecha).toLocaleString()}:</p><p>${m.mensaje}</p><hr>`
          ).join('');
        }
      
        cargarMensajes();
      });
    
