from flask import Flask

# Imports the Cloud Logging client library
import google.cloud.logging

from app.views import auth, purchase, render_po_template, user
from app.views.api.v1 import purchases as purchases_api
from app.views.filters import format_currency, pad_zeros, copyright_year
from app.workflow.user import get_log_in_out_links_and_user

import settings

# Instantiates a client
client = google.cloud.logging.Client()

# Retrieves a Cloud Logging handler based on the environment
# you're running in and integrates the handler with the
# Python logging module. By default this captures all logs
# at INFO level and higher
client.setup_logging()

app = Flask(__name__)
app.jinja_env.filters.update(
    {
        "currency": format_currency,
        "pad": pad_zeros,
        "copyright": copyright_year,
    }
)
app.secret_key = settings.SESSION_SECRET


@app.route("/")
def index():
    return render_po_template("index.html", **(get_log_in_out_links_and_user()))


app.register_blueprint(auth.bp)
app.register_blueprint(purchase.bp)
app.register_blueprint(user.bp)
app.register_blueprint(purchases_api.bp)
