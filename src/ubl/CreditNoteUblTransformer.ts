import { IFiscalDocument, ICompany, Ubl } from '../dian/IFiscalDocument';
import { UblBuildFactory } from './UblBuildFactory';

export class CreditNoteUblTransformer extends UblBuildFactory implements Ubl {
    private ROOT_TAG = 'CreditNote';

    constructor(document: IFiscalDocument, company: ICompany) {
        super(document, company);
    }

    public async mapToUbl(): Promise<CreditNoteUblTransformer> {
        const cude = await this._utils.getCudeSha384(
            this._document,
            this._company
        );
        const environment = `${this._company.testMode ? 2 : 1}`;
        this._json = {
            CreditNote: {
                $: {
                    xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2',
                    'xmlns:cac':
                        'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
                    'xmlns:cbc':
                        'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
                    'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
                    'xmlns:ext':
                        'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2',
                    'xmlns:sts':
                        'dian:gov:co:facturaelectronica:Structures-2-1',
                    'xmlns:xades': 'http://uri.etsi.org/01903/v1.3.2#',
                    'xmlns:xades141': 'http://uri.etsi.org/01903/v1.4.1#',
                    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                    'xsi:schemaLocation':
                        'urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2     http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-CreditNote-2.1.xsd',
                },
                'ext:UBLExtensions': {
                    'ext:UBLExtension': [
                        {
                            'ext:ExtensionContent': {
                                'sts:DianExtensions': {
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
                                        cude,
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
                'cbc:ProfileID':
                    'DIAN 2.1: Nota Crédito de Factura Electrónica de Venta',
                'cbc:ProfileExecutionID': environment,
                'cbc:ID': `${
                    this._document.pos.prefix + this._document.invoiceNumber
                }`,
                'cbc:UUID': {
                    $: {
                        schemeID: environment,
                        schemeName: 'CUDE-SHA384',
                    },
                    _: cude,
                },
                'cbc:IssueDate': this._utils.formatDate(
                    this._document.invoiceDate,
                    true
                ),
                'cbc:IssueTime': this._utils.formatDate(
                    this._document.invoiceDate,
                    false
                ),
                'cbc:CreditNoteTypeCode': this._document.invoiceTypeCode,
                'cbc:Note': this._document.note,
                'cbc:DocumentCurrencyCode': {
                    $: {
                        listAgencyID: '6',
                        listID: 'Peso colombiano',
                    },
                    _: this._document.currency,
                },
                'cbc:LineCountNumeric': this._document.items.length,
                'cac:DiscrepancyResponse': {
                    'cbc:ReferenceID': this._document.relatedInvoice,
                    'cbc:ResponseCode': this._document.typeNote,
                    'cbc:Description': this._document.descriptionTypeNote,
                },
                'cac:BillingReference': {
                    'cac:InvoiceDocumentReference': {
                        'cbc:ID': this._document.relatedInvoice,
                        'cbc:UUID': {
                            $: {
                                schemeName: 'CUFE-SHA384',
                            },
                            _: this._document.relatedCufe,
                        },
                        'cbc:IssueDate': this._utils.formatDate(
                            this._document.relatedInvoiceDate,
                            true
                        ),
                    },
                },
            },
        };
        //Parent methods
        this.withSupplier(this.ROOT_TAG)
            .withCustomer(this.ROOT_TAG)
            .withPaymethods(this.ROOT_TAG)
            .withTRM(this.ROOT_TAG)
            .withTaxs(this.ROOT_TAG)
            .withTotals(this.ROOT_TAG)
        //Items CreditNoteLine
        //TODO: Call method here
        return this;
    }

    private withItems(): void {
        let i = 0;
        for (const item of this._document.items) {
            this._json.CreditNote['cac:CreditNoteLine'] = [
                {
                    'cbc:ID': ++i,
                    'cbc:CreditedQuantity': {
                        $: {
                            'unitCode': this._utils.UNIT_CODE_CREDIT_NOTE
                        },
                        _: item.quantity
                    },
                    'cbc:LineExtensionAmount': {
                        $: {
                            currencyID: this._document.currency,
                        },
                        _: item.totalPrice,
                    },
                }
            ];
        }
    }
}
