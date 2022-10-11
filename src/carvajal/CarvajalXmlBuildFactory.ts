import { IFiscalDocument, ICompany, Ubl } from '../dian/IFiscalDocument';
const xml2js = require('xml2js');
import { Utils } from '../dian/Utils';

export class CarvajalXmlBuildFactory {
    _json: any;
    _xml = '';
    _document: IFiscalDocument;
    _company: ICompany;
    _utils: Utils;

    constructor(document: IFiscalDocument, company: ICompany) {
        this._document = document;
        this._company = company;
        this._utils = new Utils();
    }

    public withSupplier(key: string): CarvajalXmlBuildFactory {
        this._json[key]['EMI'] = {
            // EMI_1: this._company.additionalAccountID,
            // EMI_2: this._company.identificationNumber,
            // EMI_3: this._company.documentType,
            // EMI_4: 'No aplica',
            // EMI_6: this._company.fullName,
            EMI_7: this._company.fullName, //Nombre comercial del emisor o del punto de dispensacion
            // EMI_10: this._company.addressLine,
            // EMI_11: this._company.stateCode,
            // EMI_13: this._company.cityName,
            // EMI_14: this._company.postalCode,
            // EMI_15: this._company.countryCode,
            // EMI_19: this._company.stateName,
            // EMI_21: this._company.countryName,
            // EMI_22: this._company.dv,
            // EMI_23: this._company.cityCode,
            // EMI_24: this._company.fullName,
            //Codigo CIIU
            //EMI_25: '' 
        };
        return this;
    }

    public withFiscalAddress(key: string): CarvajalXmlBuildFactory {
        this._json[key]['DFE'] = {
            DFE_1: this._company.cityCode,
            DFE_2: this._company.cityCode,
            DFE_3: this._company.countryCode,
            DFE_4: this._company.postalCode,
            DFE_5: this._company.countryName,
            DFE_6: this._company.stateName,
            DFE_7: this._company.cityCode,
            //DFE_8: ''
        };
        return this;
    }

    public withCustomer(key: string): CarvajalXmlBuildFactory {
        this._json[key]['ADQ'] = {
            //Nota: Se debe informar el código “2” cuando se trate de informar al consumidor final.
            ADQ_1: this._document.customer.entityType,
            ADQ_2: this._document.customer.identificationNumber,
            ADQ_3: this._document.customer.documentType,
            //Regimen al que pertenece el cliente
            ADQ_4: '49',
            //Número de identificación interno asignado por el proveedor
            //ADQ_5: '',
            ADQ_6: this._document.customer.businessName,
            ADQ_7: this._document.customer.businessName,
            ADQ_8: this._document.customer.businessName,
            //Si es persona natural se debe expresar los apellidos
            //ADQ_9: this._document.customer.businessName,
            ADQ_10: this._document.customer.fiscalAddress,
            ADQ_11: this._document.customer.state, //Codigo del departamento
            ADQ_13: this._document.customer.city, //Nombre de la ciudad
            ADQ_14: this._document.customer.postalCode,
            //ADQ_15: this._document.customer.country, //Codigo del pais 'CO'
            ADQ_19: this._document.customer.state, //Nombre del departamento
            TCR: {
                TCR_1: 'R-99-PN'
            },
            CDA: {
                CDA_1: '1',
                CDA_2: this._document.customer.businessName, //Nombre y cardo de la persona de contacto.
                CDA_4: this._document.customer.personalEmail,
            }
        };
        return this;
    };

    public withTotals(key: string): CarvajalXmlBuildFactory {
        this._json[key]['TOT'] = {
            //Subtotal del documento
            TOT_1: this._document.subtotalAmount,
            TOT_2: this._document.currency,
            TOT_3: this._document.taxedAmount,
            TOT_4: this._document.currency,
            TOT_5: this._document.subtotalAmount,
            TOT_6: this._document.currency,
            TOT_7: this._document.totalAmount,
            TOT_8: this._document.currency,
            TOT_9: this._document.ticketDiscount,
            TOT_10: this._document.currency,
            TOT_13: '0.00',
            TOT_14: this._document.currency,
        };
        return this;
    }

    public withResolution(key: string): CarvajalXmlBuildFactory {
        this._json[key]['DRF'] = {
            DRF_1: this._document.pos.resolution,
            DRF_2: this._document.pos.startDate,
            DRF_3: this._document.pos.endDate,
            DRF_4: this._document.pos.prefix,
            DRF_5: this._document.pos.rangeFrom,
            DRF_6: this._document.pos.rangeTo,
        };
        return this;
    }

    public withPayMethod(key: string): CarvajalXmlBuildFactory {
        for (const paymentMethod of this._document.paymentMethods) {
            this._json[key]['MEP'] = {
                MEP_1: paymentMethod.code,
                MEP_2: 2,
                MEP_3: this._document.paymentDueDate,   
            };
        }
        return this;
    }

    public async toXml(): Promise<string> {
        const builder = new xml2js.Builder({
            xmldec: { version: '1.0', encoding: 'UTF-8', standalone: false },
        });
        this._xml = await builder.buildObject(this._json);
        return this._xml;
    }
}