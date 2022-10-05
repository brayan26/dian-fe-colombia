import { IFiscalDocument, ICompany, Ubl } from '../dian/IFiscalDocument';
import { CarvajalXmlBuildFactory } from './CarvajalXmlBuildFactory';

export class CarvajalInvoiceTransformer extends CarvajalXmlBuildFactory implements Ubl {

    private ROOT_TAG = 'FACTURA';

    constructor(document: IFiscalDocument, company: ICompany) {
        super(document, company);
    }

    public async mapToUbl(): Promise<CarvajalInvoiceTransformer> {
        const cufe = await this._utils.getCufeSha384(
            this._document,
            this._company
        );
        const environment = `${this._company.testMode ? 2 : 1}`;
        this._json = {
            FACTURA: {
                ENC: {
                    ENC_1: this._document.carvajalInvoiceTypeCode,
                    ENC_2: this._company.identificationNumber,
                    ENC_3: this._document.customer.idCustomer,
                    ENC_4: this._utils.UBL_VERSION,
                    ENC_5: this._utils.getDianVersion(this._document.invoiceTypeCode),
                    ENC_6: `${
                        this._document.pos.prefix + this._document.invoiceNumber
                    }`,
                    //Fecha de la factura
                    ENC_7: this._utils.formatDate(
                        this._document.invoiceDate,
                        true
                    ),
                    //Hora de la factura GTM
                    ENC_8: this._utils.formatDate(
                        this._document.invoiceDate,
                        false
                    ),
                    //Tipo de documento DIAN
                    ENC_9: this._document.invoiceTypeCode,
                    ENC_10: this._document.currency,
                    //Rango de fecha del periodo de facturación
                    ENC_11: this._utils.formatDateRange(this._document.invoiceDate, 1),
                    ENC_12: this._utils.formatDateRange(this._document.invoiceDate, 30),
                    //ENC_13: '',
                    //ENC_14: '',
                    ENC_15: this._document.items.length,
                    ENC_16: this._document.dueDate,
                    //URL para enviar archivos anexos
                    //ENC_17: '',
                    //ENC_18: '',
                    //ENC_19: '',
                    ENC_20: environment,
                    ENC_21: this._utils.INVOICE_TYPE,
                    //Valor condicionado
                    ENC_22: 'SS-CUFE',
                },
                TAC: {
                    TAC_1: this._company.taxLevelCode
                },
            }
        };
        this.withSupplier(this.ROOT_TAG)
        .withFiscalAddress(this.ROOT_TAG)
        .withCustomer(this.ROOT_TAG);
        return this;
    }

}