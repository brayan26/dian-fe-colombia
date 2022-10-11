import { ICompany, IFiscalDocument, Ubl } from "../IFiscalDocument";
import { CreditNoteUblTransformer } from "./CreditNoteUblTransformer";
import { DebitNoteUblTransformer } from "./DebitNoteUblTransformer";
import { InvoiceUblTransformer } from "./InvoiceUblTransformer";

export class UblFactory {
    private static TYPE_DOCUMENT_CREDIT_NOTE = '91';
    private static TYPE_DOCUMENT_DEBIT_NOTE = '92';

    public static getInstance(document: IFiscalDocument, company: ICompany): Ubl {
        if(this.TYPE_DOCUMENT_CREDIT_NOTE === document.invoiceType) {
            return new CreditNoteUblTransformer(document, company);
        }
        if(this.TYPE_DOCUMENT_DEBIT_NOTE === document.invoiceType) {
            return new DebitNoteUblTransformer(document, company)
        }
        return new InvoiceUblTransformer(document, company);
    }
}