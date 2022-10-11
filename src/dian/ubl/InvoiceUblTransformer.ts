import { IFiscalDocument, ICompany, Ubl } from '../IFiscalDocument';
import { UblBuildFactory } from './UblBuildFactory';

export class InvoiceUblTransformer extends UblBuildFactory implements Ubl {
    private ROOT_TAG = 'Invoice';

    constructor(document: IFiscalDocument, company: ICompany) {
        super(document, company);
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
                'cbc:ProfileID': 'DIAN 2.1: Factura Electrónica de Venta',
                'cbc:ProfileExecutionID': environment,
                'cbc:ID': `${
                    this._document.pos.prefix + this._document.internalId
                }`,
                'cbc:UUID': {
                    $: {
                        schemeID: environment,
                        schemeName: 'CUFE-SHA384',
                    },
                    _: cufe,
                },
                'cbc:IssueDate': this._utils.formatDate(
                    this._document.invoiceDate,
                    true
                ),
                'cbc:IssueTime': this._utils.formatDate(
                    this._document.invoiceDate,
                    false
                ),
                'cbc:DueDate': this._document.paymentDueDate,
                'cbc:InvoiceTypeCode': this._document.invoiceType,
                'cbc:Note': '',//this._document.note,
                'cbc:DocumentCurrencyCode': this._document.currency,
                'cbc:LineCountNumeric': this._document.items.length,
            },
        };

        //Parent methods
        this.withSupplier(this.ROOT_TAG)
            .withCustomer(this.ROOT_TAG)
            .withFiscalRepresentative(this.ROOT_TAG)
            .withPaymethods(this.ROOT_TAG)
            .withTRM(this.ROOT_TAG)
            .withTaxs(this.ROOT_TAG)
            .withTotals(this.ROOT_TAG);
        //Items InvoiceLine
        this.withItems();
        return this;
    }

    private withItems(): void {
        let i = 0;
        this._json.Invoice['cac:InvoiceLine'] = [];
        for (const item of this._document.items) {
            let invoiceLine: any = {
                'cbc:ID': ++i,
                'cbc:InvoicedQuantity': {
                    $: {
                        unitCode: item.um,
                    },
                    _: item.qty,
                },
                'cbc:LineExtensionAmount': {
                    $: {
                        currencyID: this._document.currency,
                    },
                    _: item.totalPrice,
                }
            };
            //Tax
            if (Object.keys(item.tax).length > 0) {
                let tax: any = {
                    'cbc:TaxAmount': {
                        $: {
                            currencyID: this._document.currency,
                        },
                        _: item.tax.amount,
                    },
                    'cbc:RoundingAmount': {
                        $: {
                            currencyID: this._document.currency,
                        },
                        _: '0.00',//item.tax.roundingAmount,
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
                            _: item.tax.amount,
                        },
                        'cac:TaxCategory': {
                            'cbc:Percent': '0.00',//item.tax.percent,
                            'cac:TaxScheme': {
                                'cbc:ID': item.tax.code,
                                'cbc:Name': item.tax.name,
                            },
                        },
                    },
                };
                invoiceLine['cac:TaxTotal'] = tax;
            }
            invoiceLine['cac:Item'] = {
                'cbc:Description': item.name,
            };
            invoiceLine['cac:Price'] = {
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
                    _: item.qty,
                }
            };
            this._json.Invoice['cac:InvoiceLine'].push(invoiceLine);
        }
    }
}
