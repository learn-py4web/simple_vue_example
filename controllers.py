"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_user_email

url_signer = URLSigner(session)

@action('setup')
@action.uses(db)
def setup():
    db(db.birds).delete()
    db.birds.insert(bird_name="Spotted Towhee")
    db.birds.insert(bird_name="Bewick's Wren")

@action('index')
@action.uses('index.html', db, url_signer, auth)
def index():
    return dict(
        # COMPLETE: return here any signed URLs you need.
        my_callback_url = URL('my_callback', signer=url_signer),
        my_post_url = URL('my_post', signer=url_signer),
        add_bird_url = URL('add_bird', signer=url_signer),
    )

@action('my_callback')
@action.uses(db, url_signer.verify())
def my_callback():
    birds=db().select(db.birds.ALL)
    return dict(birds=[{"id": b.id, "count": b.bird_count, "name": b.bird_name}
                       for b in birds])

@action('my_post', method="POST")
@action.uses(db, url_signer.verify())
def my_post():
    # The decoded json is available in request.json
    print("I received:", request.json)
    # Update the database.
    db(db.birds.id == request.json["id"]).update(
        bird_count=request.json["count"])
    # You can return anything, but I like to return "ok" if nothing
    # special is needed.
    return "ok"

@action('add_bird', method="POST")
@action.uses(db, url_signer.verify())
def add_bird():
    print("Adding bird:", request.json["bird_name"])
    bird_id = db.birds.insert(bird_name=request.json["bird_name"])
    return dict(bird_id=bird_id)
