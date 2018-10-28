from django.http import HttpResponse, JsonResponse, HttpResponseNotFound
from django.shortcuts import render
from requests_html import HTMLSession

from .forms import UsernameForm

def index(request):
    template_name = 'index.html'
    form_class = UsernameForm()
    return render(request, template_name, {'form': form_class})

def _get_followers(username):
    r = {}
    with HTMLSession() as s:
        r = s.get('https://twitter.com/{!s}'.format(username))
        followers_count = r.html.find('#page-container > div.ProfileCanopy.ProfileCanopy--withNav.ProfileCanopy--large.js-variableHeightTopBar > div > div.ProfileCanopy-navBar.u-boxShadow > div.AppContainer > div > div.Grid-cell.u-size2of3.u-lg-size3of4 > div > div > ul > li.ProfileNav-item.ProfileNav-item--followers > a > span.ProfileNav-value', first=True)
        f = '{:,}'.format(int(followers_count.attrs.get('data-count')))
        r = {
            'username': username,
            'followers': f
        }
    return r

def get_followers(request):
    template_name = 'index.html'
    twitter_info = []
    username = request.GET.get('username', '').split(',')
    form = UsernameForm()
    d = map(_get_followers, username)
    for x in d:
        twitter_info.append(x)
    context = {
        'twitter_info': twitter_info
    }
    return JsonResponse(context)
