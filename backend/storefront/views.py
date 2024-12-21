from django.http import HttpResponse
def home_page(request):
    print("Homepage requested")
    return HttpResponse("this is homePage")