/**
 * 
 * 用户增加
 * 
 * @ProjectName: HK
 * @Package: KX.zjx
 * @ClassName: KX.zjx.userAdd
 * @Description: 用户增加
 * @Author: TimTsang
 * @CreateDate: 2015年02月07日
 * @Version: [v1.0]
 * 
 */
var roleStore = null;
var userManageStoreAdd = null;
// 将getUserManageStore函数提到外部
$(function() {
			wGetUserManageStoreAdd = getUserManageStoreAdd2;
		});
function getUserManageStoreAdd2(userManageStore) {
	userManageStoreAdd = userManageStore;
}
Ext.define('KX.zjx.userAdd', {
			id : 'userAddWin',
			extend : 'Ext.window.Window',
			myForm : null,
			resizable : false,
			initComponent : function() {
				var me = this;
				var states = new Ext.data.Store({
							fields : ['name', 'value'],
							data : [{
										"name" : "已激活",
										"value" : 'true'
									}, {
										"name" : "未激活",
										"value" : 'false'
									}]
						});
				roleStore = new Ext.data.Store({
							proxy : {
								type : 'ajax',
								url : '../../character/role!findAllRole.action',
								reader : {
									type : 'array'
								}
							},
							fields : [{
										name : 'value'
									}, {
										name : 'name'
									}],
							autoLoad : true
						});

				me.myForm = new Ext.FormPanel({
							id : 'userEditForm',
							// xtype: 'form',
							margin : '10 20 0 20',
							border : false,
							defaults : {
								xtype : 'textfield',
								allowBlank : false,
								anchor : "0",
								labelWidth : 60,
								margin : '0 0 10 0'
							},
							items : [{
										xtype : 'textfield',
										name : 'user.id',
										id : 'userAddId',
										hidden : true,
										hideLabel : true,
										allowBlank : true
									}, {
										fieldLabel : "登录名",
										name : 'user.username',
										id : 'username',
										blankText : '登录名不可为空！',
										listeners : {
											'blur' : this.checkUserName
										}
									}, {
										fieldLabel : "部门",
										name : 'user.department',
										id : 'department',
										disabled : true
									}, {
										fieldLabel : "姓名",
										name : 'user.realName',
										id : 'realName'
									}, {
										fieldLabel : "用户密码",
										id : 'password1',
										name : 'newPassword',
										inputType : 'password',
										blankText : '密码不可为空'
									}, {
										fieldLabel : "密码确认",
										id : 'password2',
										name : 'newPasswordCfm',
										inputType : 'password', // 设置输入类型为password
										blankText : '密码不可为空',
										listeners : {
											'blur' : this.checkPassWord
										}
									}, {
										xtype : 'combo',
										fieldLabel : "激活状态",
										id : 'active',
										displayField : 'name',
										editable : false,
										valueField : 'value',
										queryMode : 'local',
										store : states,
										hiddenName : 'user.active',
										name : 'user.active'
									}, {
										xtype : 'combo',
										id : 'rolesId',
										store : roleStore,
										fieldLabel : '所属角色',
										emptyText : '请选择',
										multiSelect : true,
										displayField : 'name',
										editable : false,
										valueField : 'value',
										queryMode : 'local'
										// hiddenName : 'user.roles',
										// name : 'user.roles',
								}]
						});
				Ext.applyIf(me, {
							width : 300,
							height : 330,
							items : [me.myForm],
							buttons : [{
										text : '确定',
										handler : me.submitForm,
										scope : this
									}, {
										text : '取消',
										handler : me.onClose,
										scope : this
									}]
						});
				me.callParent(arguments);
			},
			
			//验证登录名
			checkUserName : function(){
				var userName = Ext.getCmp("username").value;
				Ext.Ajax.request({
					method : "POST",
					url : '../../character/user!checkUsername.action',
					params : {
						username:userName
					},
					success : function(response, options) {
						jsonObj = Ext.decode(response.responseText);
						if (jsonObj.result == true) {
							
						} else {
							Ext.getCmp("username").setValue("");
							Ext.Msg.show({
										title : '错误提示',
										msg : jsonObj.msg,
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									});
						}

					},
					failure : function(response, options) {
						Ext.Msg.show({
									title : '错误提示',
									msg : '数据加载失败！',
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								});
					}
				});
			},
			
			checkPassWord : function(textfield) {
				var password2 = Ext.getCmp('password2').getValue();
				var password = Ext.getCmp('password1').getValue();
				if (password != password2) {
					textfield.markInvalid("两次密码输入不一致");
				} else {
					Ext.getCmp('password1').clearInvalid();
					textfield.clearInvalid();
				}
			},

			onClose : function() {
				this.doClose();
			},

			submitForm : function() {
				if (this.myForm.getForm().isValid()) {
					var active = this.myForm.getForm().findField('user.active').value;
					if (active == '已激活') {
						active = true;
					} else if (active == '未激活') {
						active = false;
					}
					var newPassword = Ext.getCmp("password1").value;
					var newPasswordCfm = Ext.getCmp("password2").value;
					//进行密码加密处理
					setMaxDigits(130);
					//获取RSA公钥进行加密
					Ext.Ajax.request({
						url : '../../character/user!getRSAKey.action',
						method : 'POST',
						success:  function(response,options){
								jsonObj = Ext.decode(response.responseText);
						    	var success = jsonObj.success;
						    	if(success == true){
						    		var strPublicKeyExponent = jsonObj.exponent;
						    		var strPublicKeyModulus = jsonObj.modulus;
						    		var key = new RSAKeyPair(strPublicKeyExponent, "",strPublicKeyModulus);
						    		var encryptNewPassword = encryptedString(key, newPassword);
						    		var encryptNewPasswordCfm = encryptedString(key, newPasswordCfm);
									Ext.Ajax.request({
										method : "POST",
										url : '../../character/user!save.action',
										params : {
											'emergencyStaffId' : Ext.getCmp("userAddId").value,
											'user.username' : Ext.getCmp("username").value,
											'user.realName' : Ext.getCmp("realName").value,
											'newPassword' : encryptNewPassword,
											'newPasswordCfm' : encryptNewPasswordCfm,
											'user.active' : active,
											'rolesId' : Ext.getCmp("rolesId").value
										},

										success : function(response, options) {
											Ext.getCmp('userAddWin').close();
											jsonObj = Ext.decode(response.responseText);
											if (jsonObj.result == true) {
												userManageStoreAdd.reload();
												Ext.MessageBox.alert('温馨提示','数据已经成功提交！');
											} else {
												Ext.Msg.show({
															title : '提交失败',
															msg : jsonObj.msg,
															buttons : Ext.Msg.OK,
															icon : Ext.Msg.ERROR
														});
											}

										},
										failure : function(response, options) {
											Ext.Msg.show({
														title : '错误提示',
														msg : '数据加载失败！',
														buttons : Ext.Msg.OK,
														icon : Ext.Msg.ERROR
													});
										}
									});
						    	}else{
						    		console.info("RSA公钥获取失败！");
						    	}
					    },
					    failure: function(response,options){
					    	console.dir(response);
					    }
					});
				} else {
					Ext.Msg.alert("温馨提示", "请检查填写表格！");
				}
			}
		});
