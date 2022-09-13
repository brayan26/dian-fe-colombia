const xml2js = require("xml2js");
import { Utils } from "./Utils";
import { IFiscalDocument, ICompany } from "./IFiscalDocument";

export class UblTransformer {
  private COLOMBIA_CODE_ISO_2 = "CO";
  private SCHEMA_AGENCY_NAME =
    "CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)";
  private SCHEMA_AGENCY_ID = "195";
  private DIAN_DV = "4";
  private DIAN_IDENTIFICATION_NUMBER = "800197268";
  private DIAN_DOC_TYPE = "31";
  private UBL_VERSION = "UBL 2.1";
  private INVOICE_TYPE = "10";

  constructor() {}

  public async transformToInvoice(
    document: IFiscalDocument,
    company: ICompany
  ): Promise<string> {
    const builder = new xml2js.Builder({
      xmldec: { version: "1.0", encoding: "UTF-8", standalone: false },
    });
    const utils = new Utils();
    const cufe = await utils.getCufeSha384(document, company);
    const environment = `${company.testMode ? 2 : 1}`;

    const invoice = {
      //root
      Invoice: {
        $: {
          xmlns: "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
          "xmlns:cac":
            "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
          "xmlns:cbc":
            "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
          "xmlns:ext":
            "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
          "xmlns:sts": "dian:gov:co:facturaelectronica:Structures-2-1",
          "xmlns:xades": "http://uri.etsi.org/01903/v1.3.2#",
          "xmlns:xades141": "http://uri.etsi.org/01903/v1.4.1#",
          "xmlns:ds": "http://www.w3.org/2000/09/xmldsig#",
          "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
          "xsi:schemaLocation":
            "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2     http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd",
        },
        "ext:UBLExtensions": {
          "ext:UBLExtension": [
            {
              "ext:ExtensionContent": {
                "sts:DianExtensions": {
                  "sts:InvoiceControl": {
                    "sts:InvoiceAuthorization": document.pos.resolution,
                    "sts:AuthorizationPeriod": {
                      "cbc:StartDate": document.pos.startDate,
                      "cbc:EndDate": document.pos.endDate,
                    },
                    "sts:AuthorizedInvoices": {
                      "sts:Prefix": document.pos.prefix,
                      "sts:From": document.pos.rangeFrom,
                      "sts:To": document.pos.rangeTo,
                    },
                  },
                  "sts:InvoiceSource": {
                    "cbc:IdentificationCode": {
                      $: {
                        listAgencyID: "6",
                        listAgencyName:
                          "United Nations Economic Commission for Europe",
                        listSchemeURI:
                          "urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1",
                      },
                      _: this.COLOMBIA_CODE_ISO_2,
                    },
                  },
                  "sts:SoftwareProvider": {
                    "sts:ProviderID": {
                      $: {
                        schemeID: company.dv,
                        schemeName: company.documentType,
                        schemeAgencyID: "195",
                        schemeAgencyName: this.SCHEMA_AGENCY_NAME,
                      },
                      _: company.identificationNumber,
                    },
                    "sts:SoftwareID": {
                      $: {
                        schemeAgencyID: this.SCHEMA_AGENCY_ID,
                        schemeAgencyName: this.SCHEMA_AGENCY_NAME,
                      },
                      _: company.softwareID,
                    },
                  },
                  "sts:SoftwareSecurityCode": {
                    $: {
                      schemeAgencyID: this.SCHEMA_AGENCY_ID,
                      schemeAgencyName: this.SCHEMA_AGENCY_NAME,
                    },
                    _: await utils.getSoftwareSecurityCode(document, company),
                  },
                  "sts:AuthorizationProvider": {
                    "sts:AuthorizationProviderID": {
                      $: {
                        schemeAgencyID: this.SCHEMA_AGENCY_ID,
                        schemeAgencyName: this.SCHEMA_AGENCY_NAME,
                        schemeID: this.DIAN_DV,
                        schemeName: this.DIAN_DOC_TYPE,
                      },
                      _: this.DIAN_IDENTIFICATION_NUMBER,
                    },
                  },
                  "sts:QRCode": utils.getQRCode(cufe, company),
                },
              },
            },
            {
              //TODO: Electronic signature here
              "ext:ExtensionContent": {},
            },
          ],
        },
        "cbc:UBLVersionID": this.UBL_VERSION,
        "cbc:CustomizationID": this.INVOICE_TYPE,
        "cbc:ProfileExecutionID": environment,
        "cbc:ID": `${document.pos.prefix + document.invoiceNumber}`,
        "cbc:UUID": {
          $: {
            schemeID: environment,
            schemeName: "CUFE-SHA384",
          },
          _: await utils.getCufeSha384(document, company),
        },
        "cbc:IssueDate": utils.formatDate(document.invoiceDate, true),
        "cbc:IssueTime": utils.formatDate(document.invoiceDate, false),
        "cbc:DueDate": document.dueDate,
        //Convertir en maestro: 01 = Factura, 91 = N.Crédito, 92 = N.Déebito
        "cbc:InvoiceTypeCode": "01",
        "cbc:Note": document.note,
        "cbc:DocumentCurrencyCode": document.currency,
        "cbc:LineCountNumeric": document.items.length,
        
      }    
    };
    return builder.buildObject(invoice);
  }
}
