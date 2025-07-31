import { type KritikSaran } from '@/types';

export const exportToCSV = (data: KritikSaran[], selectedIds: string[] = []) => {
    const dataToExport = selectedIds.length > 0
        ? data.filter(item => selectedIds.includes(String(item.id)))
        : data;

    if (dataToExport.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    const headers = [
        'ID',
        'Nama',
        'Email',
        'Telepon',
        'Alamat',
        'Perawatan Terkait',
        'Nama Poli',
        'Nama Kamar/No Kamar',
        'Kritik',
        'Saran',
        'Tanggal Dibuat'
    ];

    const csvContent = [
        headers.join(','),
        ...dataToExport.map(item => [
            String(item.id),
            `"${item.nama || ''}"`,
            `"${item.email || ''}"`,
            `"${item.telepon || ''}"`,
            `"${item.alamat || ''}"`,
            `"${item.perawatan_terakait || ''}"`,
            `"${item.nama_poli || ''}"`,
            `"${item.nama_kmr_no_kmr || ''}"`,
            `"${item.kritik || ''}"`.replace(/"/g, '""'),
            `"${item.saran || ''}"`.replace(/"/g, '""'),
            `"${new Date(item.createdAt).toLocaleDateString('id-ID')}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `kritik-saran-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const exportToJSON = (data: KritikSaran[], selectedIds: string[] = []) => {
    const dataToExport = selectedIds.length > 0
        ? data.filter(item => selectedIds.includes(String(item.id)))
        : data;

    if (dataToExport.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    const jsonContent = JSON.stringify(dataToExport, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value, 2
    );

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `kritik-saran-${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const exportToExcel = async (data: KritikSaran[], selectedIds: string[] = []) => {
    const dataToExport = selectedIds.length > 0
        ? data.filter(item => selectedIds.includes(String(item.id)))
        : data;

    if (dataToExport.length === 0) {
        throw new Error('Tidak ada data untuk diekspor');
    }

    // Import exceljs secara dinamis
    const ExcelJS = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Kritik & Saran');

    // Add headers
    worksheet.addRow([
        'ID', 'Nama', 'Email', 'Telepon', 'Alamat',
        'Perawatan Terkait', 'Nama Poli', 'Nama Kamar/No Kamar',
        'Kritik', 'Saran', 'Tanggal Dibuat'
    ]);

    // Add data
    dataToExport.forEach(item => {
        worksheet.addRow([
            String(item.id),
            item.nama || '',
            item.email || '',
            item.telepon || '',
            item.alamat || '',
            item.perawatan_terakait || '',
            item.nama_poli || '',
            item.nama_kmr_no_kmr || '',
            item.kritik || '',
            item.saran || '',
            new Date(item.createdAt).toLocaleDateString('id-ID')
        ]);
    });

    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `kritik-saran-${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};