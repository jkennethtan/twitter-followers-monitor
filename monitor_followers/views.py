from django.http import HttpResponse
from django.shortcuts import render
from requests_html import HTMLSession

def index(request):
    template_name = 'index.html'
    search = [
        'iwakura_azusa',
        'eririn959',
        'vampiretoricago',
    ]

    r = []
    context = {}

    for x in search:
        r.append(get_followers(x))
    
    context['title']        = 'Monitor Followers'
    context['twitter_info'] = r
    return render(request, template_name, context)

def get_followers(twitter_username):
    r = {}
    with HTMLSession() as s:
        while True:
            try:
                r = s.get('https://twitter.com/{!s}'.format(twitter_username))
                followers_count = r.html.find('#page-container > div.ProfileCanopy.ProfileCanopy--withNav.ProfileCanopy--large.js-variableHeightTopBar > div > div.ProfileCanopy-navBar.u-boxShadow > div.AppContainer > div > div.Grid-cell.u-size2of3.u-lg-size3of4 > div > div > ul > li.ProfileNav-item.ProfileNav-item--followers > a > span.ProfileNav-value', first=True)
                f = followers_count.text
                r = {
                    'username': twitter_username,
                    'followers': f
                }
                break
            except AttributeError:
                pass
        return r