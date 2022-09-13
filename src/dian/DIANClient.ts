import xml2js from 'xml2js';

class DianClient {
    _certificate: string;
    _privateKey: string;
    _company: ICompany;

    constructor(certificate: string, privateKey: string, company: ICompany) {
        this._certificate = certificate;
        this._privateKey = privateKey;
        this._company = company;
    }

    public parse() {
        let builder = new xml2js.Builder();
    }

}