import { ICompany, IFiscalDocument, Ubl } from "../dian/IFiscalDocument";
import { Utils } from "../dian/Utils";

export class CreditNoteUblTransformer implements Ubl {
    _json: any;
    _xml = '';
    private _document: IFiscalDocument;
    private _company: ICompany;
    private _utils: Utils;

    constructor(document: IFiscalDocument, company: ICompany) {
        this._document = document;
        this._company = company;
        this._utils = new Utils();
    }
    
    mapToUbl(document: IFiscalDocument, company: ICompany) {
        throw new Error("Method not implemented.");
    }
}