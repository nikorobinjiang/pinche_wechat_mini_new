# Generated by Django 2.1.5 on 2019-03-01 04:59

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('app_main', '0007_hottripsearch'),
    ]

    operations = [
        migrations.AddField(
            model_name='hottripsearch',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='hottripsearch',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app_main.User'),
        ),
        migrations.AlterField(
            model_name='hottripsearch',
            name='departure',
            field=models.CharField(default='', max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='hottripsearch',
            name='destination',
            field=models.CharField(default='', max_length=30, null=True),
        ),
    ]