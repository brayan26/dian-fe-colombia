//import xml2js from 'xml2js';
import { ICompany, IFiscalDocument } from './IFiscalDocument';

export class DianClient {
    _certificate: string;
    _privateKey: string;
    _company: ICompany;
    _document: IFiscalDocument

    constructor(certificate: string, privateKey: string, document:IFiscalDocument, company: ICompany) {
        this._certificate = certificate;
        this._privateKey = privateKey;
        this._company = company;
        this._document = document;
    }

    public parse() {
        
    }

}