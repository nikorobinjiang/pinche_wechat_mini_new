from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.
from django.http import HttpResponse,JsonResponse
from app_main.models import TripInfo
from app_main.models import HotTripSearch

from django.db.models import Q

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

def getHotTrips(request):
    userId = request.GET.get('user_id',0)
    result = HotTripSearch.objects.filter(Q(show=1) | Q(user_id=userId)).values('id','departure','destination').all()[:5]
    # return HttpResponse(json.dumps(result,default = myconverter))
    result = list(result)
    return HttpResponse(json.dumps(result))

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
    searchParams =  request.GET.get('search')
    searchParams = json.loads(searchParams)
    search_departure = searchParams['departure']
    search_destination = searchParams['destination']
    search_leave_date = searchParams['leave_date']
    # 拼车类型
    if int(tabType) == 1:
        query = query.filter(pc_type=1)
    elif int(tabType) == 2:
        query = query.filter(pc_type=2)
    # 搜索
    query = query.filter(departure__contains = search_departure)
    query = query.filter(destination__contains = search_destination)
    if search_leave_date :
        query = query.filter(leave_date = search_leave_date)
    query = query.order_by("-updated_at")
    tripList = query.values('id', 'departure', 'destination', 'leave_date', 'leave_time', 'seats_count', 'people_count', 
    'pc_type', 'demo', 'price', 'status', 'contact_phone', 'contact_wechat_account', 'contact_gender', 'contact_name',
    'created_at', 'updated_at', 'user__nickName', 'user__avatarUrl')[offset:offset+countPerPage]
    
    # 将搜索内容保存到数据库 TODO 先放入缓存队列
    if(search_departure and search_destination and request.GET.get('user_id')):
        obj = HotTripSearch()
        obj.user_id = request.GET.get('user_id')
        obj.departure = search_departure
        obj.destination = search_destination
        obj.save()    

    # tripList = serializers.serialize("json",tripList)
    tripList = list(tripList)
    # for item in tripList:
        # return HttpResponse(isinstance(item['leave_time'], time))
    return HttpResponse(json.dumps(tripList,default = myconverter))
    # return HttpResponse(searchParams)
    # return JsonResponse(tripList,safe=False)

def myTripList(request):
    query = TripInfo.objects
    # 用户id
    userId = request.GET.get('user_id')
    query = query.filter(user_id=userId)
    # 分页
    page = request.GET.get('page',1)
    countPerPage = 10
    offset = countPerPage * (int(page) - 1)
    # 拼车类型 3=all 2=找人 1=找车
    tabType = request.GET.get('tabType',3)
    if int(tabType) == 1:
        query = query.filter(pc_type=1)
    elif int(tabType) == 2:
        query = query.filter(pc_type=2)
    
    query = query.order_by("-updated_at")
    tripList = query.values('id', 'departure', 'destination', 'leave_date', 'leave_time', 'seats_count', 'people_count', 
    'pc_type', 'demo', 'price', 'status', 'contact_phone', 'contact_wechat_account', 'contact_gender', 'contact_name',
    'created_at', 'updated_at', 'user__nickName', 'user__avatarUrl')[offset:offset+countPerPage]
    tripList = list(tripList)
    
    return HttpResponse(json.dumps(tripList,default = myconverter))


def createOrUpdateTrip(request):
    tripId = request.GET.get('tripId')
    if tripId:
        try:
            obj = TripInfo.objects.values('id', 'departure', 'destination', 'leave_date', 'leave_time', 'seats_count', 'people_count', 
            'pc_type', 'demo', 'price', 'status', 'contact_phone', 'contact_wechat_account', 'contact_gender', 'contact_name',
            'created_at', 'updated_at', 'user__nickName', 'user__avatarUrl').get(id=tripId)
        except TripInfo.DoesNotExist:
            return JsonResponse({'message':'该行程不存在','info':'error'})
    else:
        obj = TripInfo()
    if request.POST.get('pc_type') == 'driver':
      obj.pc_type = 2
    else:
      obj.pc_type = 1

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
    obj.user_id = request.POST.get('user_id')

    obj.save()
    return JsonResponse({'message':'发布成功','info':'success'})


def tripDetail(request):
    tripId = request.GET.get('trip_id',0)
    try:
        obj = TripInfo.objects.values('id', 'departure', 'destination', 'leave_date', 'leave_time', 'seats_count', 'people_count', 
        'pc_type', 'demo', 'price', 'status', 'contact_phone', 'contact_wechat_account', 'contact_gender', 'contact_name',
        'created_at', 'updated_at', 'user__nickName', 'user__avatarUrl').get(id=tripId)
    except TripInfo.DoesNotExist:
        return JsonResponse({'message':'该行程不存在','info':'error'})
    # return JsonResponse(json.dumps(obj,default = myconverter),safe=False)
    return JsonResponse(obj)
  
def myconverter(o):
    if isinstance(o, datetime) or isinstance(o, date) or isinstance(o, time):
        return o.__str__()
    


