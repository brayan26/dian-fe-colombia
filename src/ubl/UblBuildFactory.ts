import { IFiscalDocument, ICompany, Ubl } from '../dian/IFiscalDocument';
const xml2js = require('xml2js');
import { Utils } from '../dian/Utils';

export class UblBuildFactory {
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


    public withSupplier(key: string): UblBuildFactory {
        this._json[key]['cac:AccountingSupplierParty'] = {
            'cbc:AdditionalAccountID': {
                $: {
                    schemeAgencyID: this._utils.SCHEMA_AGENCY_ID,
                },
                _: this._company.additionalAccountID,
            },
            'cac:Party': {
                'cac:PartyName': {
                    'cbc:Name': this._company.fullName,
                },
                'cac:PhysicalLocation': {
                    'cac:Address': {
                        'cbc:ID': this._company.cityCode,
                        'cbc:CityName': this._company.cityName,
                        'cbc:CountrySubentity': this._company.stateName,
                        'cbc:CountrySubentityCode': this._company.stateCode,
                        'cac:AddressLine': {
                            'cbc:Line': this._company.addressLine,
                        },
                    },
                },
                'cac:PartyTaxScheme': {
                    'cbc:RegistrationName': this._company.fullName,
                    'cbc:CompanyID': {
                        $: {
                            schemeAgencyID: this._utils.SCHEMA_AGENCY_ID,
                            schemeAgencyName: this._utils.SCHEMA_AGENCY_NAME,
                            schemeID: this._company.dv,
                            schemeName: this._company.documentType,
                        },
                        _: this._company.identificationNumber,
                    },
                    'cbc:TaxLevelCode': this._company.taxLevelCode,
                    'cac:RegistrationAddress': {
                        'cbc:ID': this._company.cityCode,
                        'cbc:CityName': this._company.cityName,
                        'cbc:CountrySubentity': this._company.stateName,
                        'cbc:CountrySubentityCode': this._company.stateCode,
                        'cac:AddressLine': {
                            'cbc:Line': this._company.addressLine,
                        },
                        'cac:Country': {
                            'cbc:IdentificationCode': this._company.countryCode,
                            'cbc:Name': {
                                $: {
                                    languageID: this._utils.LANGUAJE_ID,
                                },
                                _: this._company.countryName,
                            },
                        },
                    },
                    'cac:TaxScheme': {
                        'cbc:ID': this._company.taxId
                            ? this._company.taxId
                            : '',
                        'cbc:Name': this._company.taxName
                            ? this._company.taxName
                            : '',
                    },
                },
                'cac:PartyLegalEntity': {
                    'cbc:RegistrationName': this._company.fullName,
                    'cbc:CompanyID': {
                        $: {
                            schemeAgencyID: this._utils.SCHEMA_AGENCY_ID,
                            schemeAgencyName: this._utils.SCHEMA_AGENCY_NAME,
                            schemeID: this._company.dv,
                            schemeName: this._company.documentType,
                        },
                        _: this._company.identificationNumber,
                    },
                    //cac:CorporateRegistrationScheme
                },
                'cac:Contact': {
                    'cbc:Telephone': this._company.contactPhone,
                    'cbc:ElectronicMail':
                        this._company.contactElectronicMail,
                },
            },
        };
        return this;
    }

    public withCustomer(key: string): UblBuildFactory {
        this._json[key]['cac:AccountingCustomer'] = {
            'cbc:AdditionalAccountID': this._document.customer.entityType,
            'cac:Party': {
                'cac:PartyIdentification': {
                    'cbc:ID': this._document.customer.idCustomer,
                },
                'cac:PartyName': {
                    'cbc:Name': this._document.customer.name,
                },
                'cac:PhysicalLocation': {
                    'cac:Address': {
                        'cbc:ID': this._document.customer.cityCode,
                        'cbc:CityName': this._document.customer.cityName,
                        'cbc:CountrySubentity':
                            this._document.customer.departmentName,
                        'cbc:CountrySubentityCode':
                            this._document.customer.departmentCode,
                        'cac:AddressLine': {
                            'cbc:Line': this._document.customer.fiscalAddress,
                        },
                        'cac:Country': {
                            'cbc:IdentificationCode': this._company.countryCode,
                            'cbc:Name': {
                                $: {
                                    languageID: this._utils.LANGUAJE_ID,
                                },
                                _: this._company.countryName,
                            },
                        },
                    },
                },
                'cac:PartyTaxScheme': {
                    'cbc:RegistrationName': this._document.customer.name,
                    'cbc:CompanyID': {
                        $: {
                            schemeAgencyID: this._utils.SCHEMA_AGENCY_ID,
                            schemeAgencyName: this._utils.SCHEMA_AGENCY_NAME,
                            schemeID: this._document.customer.dvNit,
                            schemeName: this._document.customer.documentType,
                        },
                        _: this._document.customer.idCustomer,
                    },
                    'cbc:TaxLevelCode': this._document.customer.taxLevelCode
                        ? this._document.customer.taxLevelCode
                        : 'R-99-PN',
                    'cac:TaxScheme': {
                        'cbc:ID': this._document.customer.taxId
                            ? this._document.customer.taxId
                            : 'ZZ',
                        'cbc:Name': this._document.customer.taxName
                            ? this._document.customer.taxName
                            : 'No Aplica',
                    },
                },
                'cac:PartyLegalEntity': {
                    'cbc:RegistrationName': this._document.customer.name,
                    'cbc:CompanyID': {
                        $: {
                            schemeAgencyID: this._utils.SCHEMA_AGENCY_ID,
                            schemeAgencyName: this._utils.SCHEMA_AGENCY_NAME,
                            schemeID: this._document.customer.dvNit,
                            schemeName: this._document.customer.documentType,
                        },
                        _: this._document.customer.idCustomer,
                    },
                },
                'cac:Contact': {
                    'cbc:Telephone': this._document.customer.contactPhone,
                    'cbc:ElectronicMail':
                        this._document.customer.contactElectronicMail,
                },
            },
        };
        return this;
    }

    public withFiscalRepresentative(key: string): UblBuildFactory {
        this._json[key]['cac:TaxRepresentativeParty'] = {
            'cac:PartyIdentification': {
                'cbc:ID': {
                    $: {
                        schemeAgencyID: this._utils.SCHEMA_AGENCY_ID,
                        schemeAgencyName: this._utils.SCHEMA_AGENCY_NAME,
                        schemeID: this._document.customer.dvNit,
                        schemeName: this._document.customer.documentType,
                    },
                    _: this._document.customer.idCustomer,
                },
                'cac:PartyName': {
                    'cbc:Name': this._document.customer.name,
                },
            },
        };
        return this;
    }

    public withTaxs(key: string): UblBuildFactory {
        for (const tax of this._document.relatedTaxes) {
            this._json[key]['cac:TaxTotal'] = [
                {
                    'cbc:TaxAmount': {
                        $: {
                            currencyID: this._document.currency,
                        },
                        _: tax.totalAmount,
                    },
                    'cbc:RoundingAmount': {
                        $: {
                            currencyID: this._document.currency,
                        },
                        _: tax.roundingAmount,
                    },
                    'cac:TaxSubtotal': {
                        'cbc:TaxableAmount': {
                            $: {
                                currencyID: this._document.currency,
                            },
                            _: tax.baseAmount,
                        },
                        'cbc:TaxAmount': {
                            $: {
                                currencyID: this._document.currency,
                            },
                            _: tax.totalAmount,
                        },
                        'cac:TaxCategory': {
                            'cbc:Percent': tax.percent,
                            'cac:TaxScheme': {
                                'cbc:ID': tax.code,
                                'cbc:Name': tax.name,
                            },
                        },
                    },
                },
            ];
        }
        return this;
    }

    public withPaymethods(key: string): UblBuildFactory {
        let i = 0;
        for (const paymentMethod of this._document.paymentMethods) {
            this._json[key]['cac:PaymentMeans'] = [
                {
                    'cbc:ID': paymentMethod.paymentType,
                    'cbc:PaymentMeansCode': paymentMethod.code,
                    'cbc:PaymentDueDate': paymentMethod.dueDate,
                    'cbc:PaymentID': ++i,
                },
            ];
        }
        return this;
    }

    public withTRM(key: string): UblBuildFactory {
        this._json[key]['cac:PaymentExchangeRate'] = {
            'cbc:SourceCurrencyCode': this._document.currency,
            'cbc:SourceCurrencyBaseRate': '1.00',
            'cbc:TargetCurrencyCode': this._document.currency,
            'cbc:TargetCurrencyBaseRate': '1.00',
            'cbc:CalculationRate': '1.00',
            'cbc:Date': this._utils.formatDate(
                this._document.invoiceDate,
                true
            ),
        };
        return this;
    }

    public withTotals(key: string): UblBuildFactory {
        this._json[key]['cac:LegalMonetaryTotal'] = {
            'cbc:LineExtensionAmount': {
                $: {
                    currencyID: this._document.currency,
                },
                _: this._document.subtotal,
            },
            'cbc:TaxExclusiveAmount': {
                $: {
                    currencyID: this._document.currency,
                },
                _: this._document.taxExclusiveAmount,
            },
            'cbc:TaxInclusiveAmount': {
                $: {
                    currencyID: this._document.currency,
                },
                _: this._document.totalAmount,
            },
            'cbc:AllowanceTotalAmount': {
                $: {
                    currencyID: this._document.currency,
                },
                _: this._document.descountTotalAmount,
            },
            'cbc:ChargeTotalAmount': {
                $: {
                    currencyID: this._document.currency,
                },
                _: this._document.chargeTotalAmount,
            },
            'cbc:PayableAmount': {
                $: {
                    currencyID: this._document.currency,
                },
                _: this._document.totalAmount,
            },
        };
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