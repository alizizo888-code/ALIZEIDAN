<?php
/**
 * Plugin Name: MUTQAN Bridge - Home
 * Description: طبقة الربط الخلفية بين الرئيسية ومشرف الرئيسية وWordPress REST API.
 * Version: 0.1.0
 */
if (!defined('ABSPATH')) exit;
final class MUTQAN_Home_Bridge {
 const OPTION='mutqan_home_config_v1';
 public static function init(){add_action('rest_api_init',[__CLASS__,'routes']);}
 public static function routes(){register_rest_route('mutqan/v1','/home',[
  ['methods'=>'GET','callback'=>[__CLASS__,'get_home'],'permission_callback'=>'__return_true'],
  ['methods'=>'POST','callback'=>[__CLASS__,'save_home'],'permission_callback'=>function(){return current_user_can('manage_options');}],
 ]);}
 public static function defaults(){return ['primary'=>'#0b63f6','accent'=>'#12b886','heroTitle'=>'خدماتك الفنية تحت إدارة مُتقن','heroText'=>'اطلب الخدمة، تابع الطلب، واعرف حالة التنفيذ من منصة واحدة.','heroImage'=>'','services'=>[],'offers'=>[],'customCode'=>''];}
 public static function get_home(){ $saved=get_option(self::OPTION,[]); return rest_ensure_response(array_merge(self::defaults(),is_array($saved)?$saved:[])); }
 public static function save_home(WP_REST_Request $request){
  if(!current_user_can('manage_options')) return new WP_Error('forbidden','غير مصرح.', ['status'=>403]);
  $data=$request->get_json_params(); if(!is_array($data)) return new WP_Error('invalid_data','بيانات غير صالحة.', ['status'=>400]);
  $allowed=['primary','accent','heroTitle','heroText','heroImage','services','offers','customCode']; $clean=[];
  foreach($allowed as $key) if(array_key_exists($key,$data)) $clean[$key]=$data[$key];
  update_option(self::OPTION,$clean,false);
  return rest_ensure_response(['success'=>true,'data'=>array_merge(self::defaults(),$clean)]);
 }
}
MUTQAN_Home_Bridge::init();
