import { IFiscalDocument, ICompany, Ubl } from '../dian/IFiscalDocument';
const xml2js = require('xml2js');
import { Utils } from '../dian/Utils';

export class InvoiceUblTransformer implements Ubl {
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

    public async mapToUbl(): Promise<InvoiceUblTransformer> {
        const cufe = await this._utils.getCufeSha384(
            this._document,
            this._company
        );
        const environment = `${this._company.testMode ? 2 : 1}`;
        this._json = {
            //root
            Invoice: {
                $: {
                    xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
                    'xmlns:cac':
                        'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
                    'xmlns:cbc':
                        'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
                    'xmlns:ext':
                        'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2',
                    'xmlns:sts':
                        'dian:gov:co:facturaelectronica:Structures-2-1',
                    'xmlns:xades': 'http://uri.etsi.org/01903/v1.3.2#',
                    'xmlns:xades141': 'http://uri.etsi.org/01903/v1.4.1#',
                    'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
                    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                    'xsi:schemaLocation':
                        'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2     http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd',
                },
                'ext:UBLExtensions': {
                    'ext:UBLExtension': [
                        {
                            'ext:ExtensionContent': {
                                'sts:DianExtensions': {
                                    'sts:InvoiceControl': {
                                        'sts:InvoiceAuthorization':
                                            this._document.pos.resolution,
                                        'sts:AuthorizationPeriod': {
                                            'cbc:StartDate':
                                                this._document.pos.startDate,
                                            'cbc:EndDate':
                                                this._document.pos.endDate,
                                        },
                                        'sts:AuthorizedInvoices': {
                                            'sts:Prefix':
                                                this._document.pos.prefix,
                                            'sts:From':
                                                this._document.pos.rangeFrom,
                                            'sts:To':
                                                this._document.pos.rangeTo,
                                        },
                                    },
                                    'sts:InvoiceSource': {
                                        'cbc:IdentificationCode': {
                                            $: {
                                                listAgencyID: '6',
                                                listAgencyName:
                                                    'United Nations Economic Commission for Europe',
                                                listSchemeURI:
                                                    'urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1',
                                            },
                                            _: this._utils.COLOMBIA_CODE_ISO_2,
                                        },
                                    },
                                    'sts:SoftwareProvider': {
                                        'sts:ProviderID': {
                                            $: {
                                                schemeID: this._company.dv,
                                                schemeName:
                                                    this._company.documentType,
                                                schemeAgencyID: '195',
                                                schemeAgencyName:
                                                    this._utils
                                                        .SCHEMA_AGENCY_NAME,
                                            },
                                            _: this._company
                                                .identificationNumber,
                                        },
                                        'sts:SoftwareID': {
                                            $: {
                                                schemeAgencyID:
                                                    this._utils
                                                        .SCHEMA_AGENCY_ID,
                                                schemeAgencyName:
                                                    this._utils
                                                        .SCHEMA_AGENCY_NAME,
                                            },
                                            _: this._company.softwareID,
                                        },
                                    },
                                    'sts:SoftwareSecurityCode': {
                                        $: {
                                            schemeAgencyID:
                                                this._utils.SCHEMA_AGENCY_ID,
                                            schemeAgencyName:
                                                this._utils.SCHEMA_AGENCY_NAME,
                                        },
                                        _: await this._utils.getSoftwareSecurityCode(
                                            this._document,
                                            this._company
                                        ),
                                    },
                                    'sts:AuthorizationProvider': {
                                        'sts:AuthorizationProviderID': {
                                            $: {
                                                schemeAgencyID:
                                                    this._utils
                                                        .SCHEMA_AGENCY_ID,
                                                schemeAgencyName:
                                                    this._utils
                                                        .SCHEMA_AGENCY_NAME,
                                                schemeID: this._utils.DIAN_DV,
                                                schemeName:
                                                    this._utils.DIAN_DOC_TYPE,
                                            },
                                            _: this._utils
                                                .DIAN_IDENTIFICATION_NUMBER,
                                        },
                                    },
                                    'sts:QRCode': this._utils.getQRCode(
                                        cufe,
                                        this._company
                                    ),
                                },
                            },
                        },
                        {
                            //TODO: Electronic signature here
                            'ext:ExtensionContent': {},
                        },
                    ],
                },
                'cbc:UBLVersionID': this._utils.UBL_VERSION,
                'cbc:CustomizationID': this._utils.INVOICE_TYPE,
                'cbc:ProfileExecutionID': environment,
                'cbc:ID': `${
                    this._document.pos.prefix + this._document.invoiceNumber
                }`,
                'cbc:UUID': {
                    $: {
                        schemeID: environment,
                        schemeName: 'CUFE-SHA384',
                    },
                    _: await this._utils.getCufeSha384(
                        this._document,
                        this._company
                    ),
                },
                'cbc:IssueDate': this._utils.formatDate(
                    this._document.invoiceDate,
                    true
                ),
                'cbc:IssueTime': this._utils.formatDate(
                    this._document.invoiceDate,
                    false
                ),
                'cbc:DueDate': this._document.dueDate,
                'cbc:InvoiceTypeCode': this._document.invoiceTypeCode,
                'cbc:Note': this._document.note,
                'cbc:DocumentCurrencyCode': this._document.currency,
                'cbc:LineCountNumeric': this._document.items.length,
            },
        };
        this.withSupplier()
            .withCustomer()
            .withFiscalRepresentative()
            .withPaymethods()
            .withTRM()
            .withTaxs()
            .withTotals()
            .withItems();
        return this;
    }

    public withSupplier(): InvoiceUblTransformer {
        this._json.Invoice['cac:AccountingSupplierParty'] = {
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
                    'cac:Contact': {
                        'cbc:Telephone': this._company.contactPhone,
                        'cbc:ElectronicMail':
                            this._company.contactElectronicMail,
                    },
                },
            },
        };
        return this;
    }

    public withCustomer(): InvoiceUblTransformer {
        this._json.Invoice['cac:AccountingCustomer'] = {
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

    public withFiscalRepresentative(): InvoiceUblTransformer {
        this._json.Invoice['cac:TaxRepresentativeParty'] = {
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

    public withTaxs(): InvoiceUblTransformer {
        for (const tax of this._document.relatedTaxes) {
            this._json.Invoice['cac:TaxTotal'] = [
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

    public withPaymethods(): InvoiceUblTransformer {
        let i = 0;
        for (const paymentMethod of this._document.paymentMethods) {
            this._json.Invoice['cac:PaymentMeans'] = [
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

    public withTRM(): InvoiceUblTransformer {
        this._json.Invoice['cac:PaymentExchangeRate'] = {
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

    public withTotals(): InvoiceUblTransformer {
        this._json.Invoice['cac:LegalMonetaryTotal'] = {
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

    public withItems(): InvoiceUblTransformer {
        let i = 0;
        for (const item of this._document.items) {
            this._json.Invoice['cac:InvoiceLine'] = [
                {
                    'cbc:ID': ++i,
                    'cbc:InvoicedQuantity': {
                        $: {
                            unitCode: item.um,
                        },
                        _: item.quantity,
                    },
                    'cbc:LineExtensionAmount': {
                        $: {
                            currencyID: this._document.currency,
                        },
                        _: item.totalPrice,
                    },
                    'cac:TaxTotal': {
                        'cbc:TaxAmount': {
                            $: {
                                currencyID: this._document.currency,
                            },
                            _: item.tax.totalAmount,
                        },
                        'cbc:RoundingAmount': {
                            $: {
                                currencyID: this._document.currency,
                            },
                            _: item.tax.roundingAmount,
                        },
                        'cac:TaxSubtotal': {
                            'cbc:TaxableAmount': {
                                $: {
                                    currencyID: this._document.currency,
                                },
                                _: item.tax.baseAmount,
                            },
                            'cbc:TaxAmount': {
                                $: {
                                    currencyID: this._document.currency,
                                },
                                _: item.tax.totalAmount,
                            },
                            'cac:TaxCategory': {
                                'cbc:Percent': item.tax.percent,
                                'cac:TaxScheme': {
                                    'cbc:ID': item.tax.code,
                                    'cbc:Name': item.tax.name,
                                },
                            },
                        },
                    },
                    'cac:Item': {
                        'cbc:Description': item.note,
                    },
                    'cac:Price': {
                        'cbc:PriceAmount': {
                            $: {
                                currencyID: this._document.currency,
                            },
                            _: item.totalPrice,
                        },
                        'cbc:BaseQuantity': {
                            $: {
                                unitCode: item.um,
                            },
                            _: item.quantity,
                        },
                    },
                },
            ];
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
