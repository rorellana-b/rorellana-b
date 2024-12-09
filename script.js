document.getElementById('fileInput').addEventListener('change', handleFile, false);
document.getElementById('generatePDF').addEventListener('click', generatePDF, false);

let deudores = [];

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Seleccionamos la primera hoja del archivo
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        
        deudores = rows; // Guardamos los datos del archivo en la variable "deudores"
        displayData(rows); // Muestra los datos para revisión
        document.getElementById('generatePDF').style.display = 'inline';
    };

    reader.readAsBinaryString(file);
}

function displayData(data) {
    let tableHTML = '<table border="1"><tr><th>Nombre</th><th>Monto de la Deuda</th><th>Estado</th></tr>';
    
    data.forEach(deudor => {
        tableHTML += `<tr>
            <td>${deudor['Nombre']}</td>
            <td>${deudor['Monto Deuda']}</td>
            <td>${deudor['Estado']}</td>
        </tr>`;
    });
    
    tableHTML += '</table>';
    document.getElementById('deudorData').innerHTML = tableHTML;
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont('Helvetica', 'normal');
    
    // Título
    doc.text('Ficha de Deudores', 20, 20);
    
    deudores.forEach((deudor, index) => {
        let y = 30 + (index * 40); // Determinamos el espacio entre las fichas
        
        doc.text(`Deudor #${index + 1}:`, 20, y);
        doc.text(`Nombre: ${deudor['Nombre']}`, 20, y + 10);
        doc.text(`Monto Total de la Deuda: ${deudor['Monto Deuda']}`, 20, y + 20);
        doc.text(`Estado: ${deudor['Estado']}`, 20, y + 30);
        
        // Si deseas agregar más información (por ejemplo, condiciones de pago), puedes hacerlo aquí
    });
    
    // Guardar el PDF
    doc.save('ficha_deudores.pdf');
}
