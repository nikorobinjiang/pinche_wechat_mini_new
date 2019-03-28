# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from django.conf import settings
import urllib.request
from app_main.models import User
import json
from . import WXBizDataCrypt
import logging
logging.basicConfig(level=logging.INFO)

def hello(request):
    context = {}
    context['hello'] = 'Hello World~'
    return render(request,'hello.html',context)

def login(request):
    context = {}
    context['login'] = 'login here'
    return render(request,'login.html',context)

def miniLogin(request):

    # 获取请求参数
    encryptedData = request.GET.get('encryptedData')
    signature = request.GET.get('signature')
    iv = request.GET.get('iv')
    code = request.GET.get('code')
    # 微信接口获取openid sessionkey
    url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + settings.WECHAT_MINI['app_id'] + "&secret=" + settings.WECHAT_MINI['app_secret'] + "&js_code=" + code + "&grant_type=authorization_code"
    res = urllib.request.urlopen(url)
    res = res.read()
    res = json.loads(res)
    # logger
    logger = logging.getLogger(__name__)
    logger.info(res)
    # return JsonResponse(res)
    
    if 'errcode' in res.keys():
        return HttpResponse(res['errmsg'])
    # return HttpResponse(res['session_key'])
    # 解密
    pc = WXBizDataCrypt.WXBizDataCrypt(settings.WECHAT_MINI['app_id'], res['session_key'])
    res_decrypt = pc.decrypt(encryptedData, iv)

    try:
        obj = User.objects.get(wx_openid=res['openid'])
    except User.DoesNotExist:
        obj = User.objects.create(wx_openid=res['openid'])
    obj.session_key = res['session_key']
    # obj.unionid = res_decrypt['unionid']
    obj.nickName = res_decrypt['nickName']
    obj.avatarUrl = res_decrypt['avatarUrl']
    obj.province = res_decrypt['province']
    obj.gender = res_decrypt['gender']
    obj.language = res_decrypt['language']
    obj.city = res_decrypt['city']
    obj.country = res_decrypt['country']
    obj.save()
    return JsonResponse({'info':'succ','user_id':obj.id})


    