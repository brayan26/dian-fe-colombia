import { IFiscalDocument, ICompany, Ubl } from '../dian/IFiscalDocument';
import { UblBuildFactory } from './UblBuildFactory';

export class DebitNoteUblTransformer extends UblBuildFactory implements Ubl {
    private ROOT_TAG = 'DebitNote';

    constructor(document: IFiscalDocument, company: ICompany) {
        super(document, company);
    }

    
    mapToUbl() {
        throw new Error("Method not implemented.");
    }
}