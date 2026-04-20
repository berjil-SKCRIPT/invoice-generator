import type { Invoice } from '$lib/schemas/invoice';
import { modernPdf } from './templates/modern';

type Builder = (invoice: Invoice) => import('pdfmake/interfaces').TDocumentDefinitions;

const builders: Record<Invoice['template'], Builder> = {
	modern: modernPdf,
	minimal: modernPdf,
	classic: modernPdf,
	creative: modernPdf,
	corporate: modernPdf
};

export async function downloadPdf(invoice: Invoice) {
	const pdfMakeMod = (await import('pdfmake/build/pdfmake')) as any;
	const vfsMod = (await import('pdfmake/build/vfs_fonts')) as any;
	const pdfMake = pdfMakeMod.default ?? pdfMakeMod;
	const vfs = vfsMod.default?.pdfMake?.vfs ?? vfsMod.pdfMake?.vfs ?? vfsMod.default?.vfs ?? vfsMod.vfs;
	if (vfs) pdfMake.vfs = vfs;

	const builder = builders[invoice.template] ?? modernPdf;
	const doc = builder(invoice);
	const safe = (invoice.to.name || 'invoice').replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 32);
	pdfMake.createPdf(doc).download(`${invoice.number}_${safe}.pdf`);
}
