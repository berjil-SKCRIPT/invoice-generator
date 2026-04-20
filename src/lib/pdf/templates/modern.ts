import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Invoice } from '$lib/schemas/invoice';
import { invoiceTotals } from '$lib/calc/totals';
import { formatMoney } from '$lib/utils/currency-format';
import { formatHuman } from '$lib/utils/date';

export function modernPdf(invoice: Invoice): TDocumentDefinitions {
	const totals = invoiceTotals(invoice);
	const fmt = (n: number) => formatMoney(n, invoice.currency, invoice.locale);
	const brand = invoice.brand.color;

	const showHsn = invoice.region === 'IN';

	const headerCells = [
		{ text: 'DESCRIPTION', style: 'th' },
		...(showHsn ? [{ text: 'HSN/SAC', style: 'th' }] : []),
		{ text: 'QTY', style: 'th', alignment: 'right' as const },
		{ text: 'RATE', style: 'th', alignment: 'right' as const },
		{ text: 'TAX', style: 'th', alignment: 'right' as const },
		{ text: 'AMOUNT', style: 'th', alignment: 'right' as const }
	];

	const itemRows = invoice.items.map((i) => [
		i.description || '',
		...(showHsn ? [{ text: i.hsnSac ?? '', style: 'mono' as const }] : []),
		{ text: String(i.quantity), alignment: 'right' as const },
		{ text: fmt(i.rate), alignment: 'right' as const },
		{ text: `${i.taxRate}%`, alignment: 'right' as const, color: '#8e8e93' },
		{ text: fmt(i.quantity * i.rate), alignment: 'right' as const, bold: true }
	]);

	const summaryRows: any[] = [
		['Subtotal', fmt(totals.subtotal)],
		...(totals.discountAmount > 0 ? [['Discount', `−${fmt(totals.discountAmount)}`]] : [])
	];
	if (totals.gst) {
		if (totals.gst.cgst > 0) {
			summaryRows.push(['CGST', fmt(totals.gst.cgst)], ['SGST', fmt(totals.gst.sgst)]);
		} else {
			summaryRows.push(['IGST', fmt(totals.gst.igst)]);
		}
	} else if (totals.tax > 0) {
		summaryRows.push(['Tax', fmt(totals.tax)]);
	}
	if (totals.shipping > 0) summaryRows.push(['Shipping', fmt(totals.shipping)]);

	return {
		pageSize: 'A4',
		pageMargins: [48, 48, 48, 64],
		content: [
			{
				columns: [
					{
						width: '*',
						stack: [
							...(invoice.brand.logoDataUrl
								? [{ image: invoice.brand.logoDataUrl, fit: [120, 56] as [number, number], margin: [0, 0, 0, 16] as [number, number, number, number] }]
								: []),
							{ text: invoice.from.name || 'Your Business', style: 'bizName' },
							{ text: invoice.from.address || '', style: 'muted', margin: [0, 2, 0, 0] },
							...(invoice.from.taxId
								? [{ text: invoice.from.taxId, style: 'mono', margin: [0, 4, 0, 0] as [number, number, number, number] }]
								: [])
						]
					},
					{
						width: 'auto',
						alignment: 'right',
						stack: [
							{ text: 'Invoice', fontSize: 26, bold: true, color: brand, characterSpacing: -0.5 },
							{ text: `#${invoice.number}`, style: 'mono', margin: [0, 4, 0, 0] },
							{
								margin: [0, 16, 0, 0],
								table: {
									widths: ['auto', 'auto'],
									body: [
										[{ text: 'Issued', style: 'muted' }, { text: formatHuman(invoice.dateIssued), bold: true }],
										[{ text: 'Due', style: 'muted' }, { text: formatHuman(invoice.dateDue), bold: true }]
									]
								},
								layout: 'noBorders'
							}
						]
					}
				],
				margin: [0, 0, 0, 32]
			},
			{
				fillColor: '#f5f5f7',
				margin: [0, 0, 0, 24] as [number, number, number, number],
				table: {
					widths: ['*'],
					body: [
						[
							{
								stack: [
									{ text: 'BILL TO', style: 'th', margin: [0, 0, 0, 4] },
									{ text: invoice.to.name || 'Client', bold: true, fontSize: 12 },
									{ text: invoice.to.address || '', style: 'muted', margin: [0, 2, 0, 0] },
									...(invoice.to.taxId
										? [{ text: invoice.to.taxId, style: 'mono', margin: [0, 4, 0, 0] as [number, number, number, number] }]
										: [])
								],
								margin: [14, 12, 14, 12] as [number, number, number, number]
							}
						]
					]
				},
				layout: 'noBorders'
			},
			{
				table: {
					headerRows: 1,
					widths: showHsn ? ['*', 60, 40, 70, 40, 80] : ['*', 40, 70, 40, 80],
					body: [headerCells, ...itemRows]
				},
				layout: {
					hLineWidth: (i: number) => (i === 0 || i === 1 ? 0.5 : 0.25),
					vLineWidth: () => 0,
					hLineColor: () => '#e5e5e7'
				}
			},
			{
				margin: [0, 20, 0, 0],
				columns: [
					{ text: '' },
					{
						width: 220,
						stack: [
							...summaryRows.map((r) => ({
								columns: [
									{ text: r[0], color: '#6e6e73' },
									{ text: r[1], alignment: 'right' as const }
								],
								margin: [0, 0, 0, 4] as [number, number, number, number]
							})),
							{
								margin: [0, 8, 0, 0],
								columns: [
									{ text: 'Total', bold: true, fontSize: 13 },
									{ text: fmt(totals.grandTotal), bold: true, alignment: 'right' as const, fontSize: 13, color: brand }
								]
							}
						]
					}
				]
			},
			...(invoice.notes
				? [
						{
							text: invoice.notes,
							style: 'muted',
							margin: [0, 40, 0, 0] as [number, number, number, number]
						}
					]
				: [])
		],
		styles: {
			th: { bold: true, fontSize: 8, color: '#8e8e93', characterSpacing: 0.5 },
			bizName: { fontSize: 16, bold: true, characterSpacing: -0.3 },
			muted: { color: '#6e6e73', fontSize: 10 },
			mono: { fontSize: 10, color: '#6e6e73' }
		},
		defaultStyle: { font: 'Roboto', fontSize: 11, color: '#1d1d1f' }
	};
}
