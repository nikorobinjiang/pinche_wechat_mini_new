from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.
from django.http import HttpResponse,JsonResponse
from app_main.models import TripInfo
import urllib.request
import json
from django.core import serializers
from collections import Iterable
from datetime import datetime
from datetime import date
from datetime import time


# import time

def login(request):
    context = {}
    context['login'] = 'login here'
    return render(request,'login.html',context)

def getTripList(request):
    # r = TripInfo.objects.all()
    # return HttpResponse(r)
    query = TripInfo.objects
    # 分页
    page = request.GET.get('page',1)
    countPerPage = 10
    offset = countPerPage * (int(page) - 1)
    # 拼车类型 3=all 2=找人 1=找车
    tabType = request.GET.get('tabType',3)
    # 搜索条件
    search_departure = request.GET.get('departure')
    search_destination = request.GET.get('destination')
    search_leave_date = request.GET.get('leave_date')
    
    # tab
    if int(tabType) == 1:
        query = query.filter(pc_type=1)
    elif int(tabType) == 2:
        query = query.filter(pc_type=2)
    
    # search
    # query = query.filter(departure_contains = search_departure)
    # query = query.filter(destination_contains = search_destination)
    # query = query.filter(leave_date = search_leave_date)
    
    query = query.order_by("-updated_at")
    tripList = query.values('id', 'departure', 'destination', 'leave_date', 'leave_time', 'seats_count', 'people_count', 
    'pc_type', 'demo', 'price', 'status', 'contact_phone', 'contact_wechat_account', 'contact_gender', 'contact_name',
    'created_at', 'updated_at', 'user__nickName', 'user__avatarUrl')[offset:offset+countPerPage]
    
    # tripList = serializers.serialize("json",tripList)
    tripList = list(tripList)
    # for item in tripList:
        # return HttpResponse(isinstance(item['leave_time'], time))
    return HttpResponse(json.dumps(tripList,default = myconverter))
    # return HttpResponse(tripList)
    # return JsonResponse(tripList,safe=False)

def createTrip(request):
    obj = TripInfo()
    if request.POST.get('pc_type') == 'driver':
      obj.pc_type = 1
    else:
      obj.pc_type = 2

    obj.departure = request.POST.get('departure')
    obj.destination = request.POST.get('destination')
    obj.leave_date = request.POST.get('leave_date')
    obj.leave_time = request.POST.get('leave_time')
    obj.price = request.POST.get('price')
    obj.vehicle = request.POST.get('vehicle')
    obj.seats_count = request.POST.get('seats_count')
    # obj.people_count = request.POST.get('people_count')
    obj.contact_name = request.POST.get('contact_name')
    obj.contact_gender = request.POST.get('contact_gender')
    obj.contact_phone = request.POST.get('contact_phone')
    # obj.isAgree = request.POST.get('isAgree')
    obj.demo = request.POST.get('demo')

    obj.save()
    return JsonResponse({'message':'发布成功','info':'success'})
  
def myconverter(o):
    if isinstance(o, datetime) or isinstance(o, date) or isinstance(o, time):
        return o.__str__()
    


