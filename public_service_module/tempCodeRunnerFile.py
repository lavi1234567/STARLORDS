from flask import Flask, render_template, request, redirect, url_for
import uuid

app = Flask(__name__)

certificates = {
    "birth-certificate": {
        "title": "Birth Certificate",
        "documents": [
            "Proof of birth of the child (e.g., hospital birth certificate)",
            "Parents' identification documents (e.g., Aadhaar card, passport)",
            "Address proof of the parents (e.g., utility bill, rent agreement)",
            "Application form filled with details"
        ],
        "fields": [
            {"id": "child_name", "label": "Child's Name", "type": "text", "name": "child_name"},
            {"id": "date_of_birth", "label": "Date of Birth", "type": "date", "name": "date_of_birth"},
            {"id": "place_of_birth", "label": "Place of Birth", "type": "text", "name": "place_of_birth"},
            {"id": "parent_names", "label": "Parent's Names", "type": "text", "name": "parent_names"},
            {"id": "address", "label": "Address", "type": "text", "name": "address"},
            {"id": "contact", "label": "Contact Information", "type": "text", "name": "contact"}
        ]
    },
    "death-certificate": {
        "title": "Death Certificate",
        "documents": [
            "Proof of death (e.g., medical certificate from the hospital)",
            "Identification documents of the deceased (e.g., Aadhaar card, passport)",
            "Address proof of the deceased",
            "Application form filled with details",
            "Cremation/burial certificate"
        ],
        "fields": [
            {"id": "deceased_name", "label": "Deceased's Name", "type": "text", "name": "deceased_name"},
            {"id": "date_of_death", "label": "Date of Death", "type": "date", "name": "date_of_death"},
            {"id": "place_of_death", "label": "Place of Death", "type": "text", "name": "place_of_death"},
            {"id": "applicant_name", "label": "Applicant's Name", "type": "text", "name": "applicant_name"},
            {"id": "relationship", "label": "Relationship with Deceased", "type": "text", "name": "relationship"},
            {"id": "contact", "label": "Contact Information", "type": "text", "name": "contact"}
        ]
    },
    "marriage-certificate": {
        "title": "Marriage Certificate",
        "documents": [
            "Proof of marriage (e.g., wedding invitation card, marriage photograph)",
            "Age proof of both parties (e.g., birth certificate, passport)",
            "Address proof of both parties",
            "Identification documents of both parties",
            "Two passport-sized photographs of both parties",
            "Witnesses' identification documents and address proof (typically two witnesses)"
        ],
        "fields": [
            {"id": "groom_name", "label": "Groom's Name", "type": "text", "name": "groom_name"},
            {"id": "bride_name", "label": "Bride's Name", "type": "text", "name": "bride_name"},
            {"id": "date_of_marriage", "label": "Date of Marriage", "type": "date", "name": "date_of_marriage"},
            {"id": "place_of_marriage", "label": "Place of Marriage", "type": "text", "name": "place_of_marriage"},
            {"id": "witness1_name", "label": "Witness 1 Name", "type": "text", "name": "witness1_name"},
            {"id": "witness2_name", "label": "Witness 2 Name", "type": "text", "name": "witness2_name"},
            {"id": "contact", "label": "Contact Information", "type": "text", "name": "contact"}
        ]
    },
    "property-tax-certificate": {
        "title": "Property Tax Certificate",
        "documents": [
            "Latest property tax paid receipt",
            "Ownership documents of the property (e.g., sale deed, lease deed)",
            "Identification document of the property owner",
            "Address proof of the property owner",
            "Application form"
        ],
        "fields": [
            {"id": "owner_name", "label": "Owner's Name", "type": "text", "name": "owner_name"},
            {"id": "property_address", "label": "Property Address", "type": "text", "name": "property_address"},
            {"id": "contact", "label": "Contact Information", "type": "text", "name": "contact"}
        ]
    },
    "trade-license": {
        "title": "Trade License",
        "documents": [
            "Proof of business establishment (e.g., registration certificate)",
            "Address proof of the business premises",
            "Identification documents of the business owner",
            "No Objection Certificate (NOC) from the fire department (if applicable)",
            "Layout plan of the business premises",
            "Application form"
        ],
        "fields": [
            {"id": "business_name", "label": "Business Name", "type": "text", "name": "business_name"},
            {"id": "owner_name", "label": "Owner's Name", "type": "text", "name": "owner_name"},
            {"id": "business_address", "label": "Business Address", "type": "text", "name": "business_address"},
            {"id": "contact", "label": "Contact Information", "type": "text", "name": "contact"}
        ]
    },
    "building-plan-approval": {
        "title": "Building Plan Approval",
        "documents": [
            "Ownership documents of the land (e.g., sale deed, lease deed)",
            "Architectural plan and layout of the proposed building",
            "Identification documents of the owner",
            "Address proof of the owner",
            "No Objection Certificate (NOC) from relevant authorities (e.g., fire department, environmental department)",
            "Structural stability certificate from an authorized engineer",
            "Application form"
        ],
        "fields": [
            {"id": "owner_name", "label": "Owner's Name", "type": "text", "name": "owner_name"},
            {"id": "property_address", "label": "Property Address", "type": "text", "name": "property_address"},
            {"id": "contact", "label": "Contact Information", "type": "text", "name": "contact"}
        ]
    },
    "occupancy-certificate": {
        "title": "Occupancy Certificate",
        "documents": [
            "Completion certificate from the builder or architect",
            "Building plan approval copy",
            "Proof of property tax payment",
            "Identification documents of the owner",
            "Address proof of the owner",
            "No Objection Certificate (NOC) from relevant authorities (e.g., fire department)",
            "Application form"
        ],
        "fields": [
            {"id": "owner_name", "label": "Owner's Name", "type": "text", "name": "owner_name"},
            {"id": "property_address", "label": "Property Address", "type": "text", "name": "property_address"},
            {"id": "contact", "label": "Contact Information", "type": "text", "name": "contact"}
        ]
    },
    "noc": {
        "title": "No Objection Certificate (NOC)",
        "documents": [
            "Reason for the NOC (e.g., property sale, business operation)",
            "Identification documents of the applicant",
            "Address proof of the applicant",
            "Relevant supporting documents (e.g., property documents for property-related NOC)",
            "Application form"
        ],
        "fields": [
            {"id": "applicant_name", "label": "Applicant's Name", "type": "text", "name": "applicant_name"},
            {"id": "reason", "label": "Reason for NOC", "type": "text", "name": "reason"},
            {"id": "contact", "label": "Contact Information", "type": "text", "name": "contact"}
        ]
    },
    "water-connection-certificate": {
        "title": "Water Connection Certificate",
        "documents": [
            "Proof of property ownership (e.g., sale deed, lease deed)",
            "Address proof of the applicant",
            "Identification documents of the applicant",
            "Building plan approval copy (if applicable)",
            "Application form"
        ],
        "fields": [
            {"id": "owner_name", "label": "Owner's Name", "type": "text", "name": "owner_name"},
            {"id": "property_address", "label": "Property Address", "type": "text", "name": "property_address"},
            {"id": "contact", "label": "Contact Information", "type": "text", "name": "contact"}
        ]
    },
    "sanitation-certificate": {
        "title": "Sanitation Certificate",
        "documents": [
            "Proof of adherence to sanitation and hygiene standards (e.g., inspection report)",
            "Identification documents of the business owner",
            "Address proof of the business premises",
            "Application form",
            "No Objection Certificate (NOC) from relevant authorities (if applicable)"
        ],
        "fields": [
            {"id": "owner_name", "label": "Owner's Name", "type": "text", "name": "owner_name"},
            {"id": "business_address", "label": "Business Address", "type": "text", "name": "business_address"},
            {"id": "contact", "label": "Contact Information", "type": "text", "name": "contact"}
        ]
    }
}

applications = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<certificate_id>')
def certificate(certificate_id):
    if certificate_id in certificates:
        return render_template('certificate.html', id=certificate_id, **certificates[certificate_id])
    else:
        return "Certificate not found", 404

@app.route('/apply/<certificate_id>')
def apply(certificate_id):
    if certificate_id in certificates:
        return render_template('application_form.html', id=certificate_id, **certificates[certificate_id])
    else:
        return "Certificate not found", 404

@app.route('/submit/<certificate_id>', methods=['POST'])
def submit_application(certificate_id):
    if certificate_id in certificates:
        document_id = str(uuid.uuid4())
        applications[document_id] = request.form.to_dict()
        return f"Thank you for your application. Your Document ID is: {document_id}"
    else:
        return "Certificate not found", 404

@app.route('/status')
def status():
    return render_template('status.html')

@app.route('/check-status', methods=['GET'])
def check_status():
    document_id = request.args.get('document_id')
    if document_id in applications:
        status = "Pending"  # You can update the logic to check real status
        return render_template('status.html', status=status)
    else:
        return "Document ID not found", 404

if __name__ == '__main__':
    app.run(debug=True)
