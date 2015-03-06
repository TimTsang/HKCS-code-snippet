/**
 * 
 * 用户编辑
 * 
 * @ProjectName: HK
 * @Package: KX.zjx
 * @ClassName: KX.zjx.userEdit
 * @Description: 用户编辑
 * @Author: TimTsang
 * @CreateDate: 2015年01月16日
 * @Version: [v1.0]
 * 
 */
var roleStore = null;
var userManageStoreEdit = null;
// 将getUserManageStore函数提到外部
$(function() {
			wGetUserManageStore = getUserManageStore;
		});
function getUserManageStore(userManageStore) {
	userManageStoreEdit = userManageStore;
}
Ext.define('KX.zjx.userEdit', {
			id : 'userEditWin',
			extend : 'Ext.window.Window',
			resizable : false,
			myForm : null,
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
										id : 'userEditId',
										hidden : true,
										hideLabel : true,
										allowBlank : true
									}, {
										fieldLabel : "用户名称",
										name : 'user.username',
										id : 'username'
									}, {
										fieldLabel : "姓名",
										name : 'user.realName',
										id : 'realName'
									}, {
										fieldLabel : "所属部门",
										name : 'user.department',
										id : 'department',
										disabled : true
									}, {
										fieldLabel : "用户密码",
										id : 'password1',
										name : 'newPassword',
										inputType : 'password',
										emptyText : '此项不填则不更改密码',
										allowBlank : true
									}, {
										fieldLabel : "密码确认",
										id : 'password2',
										name : 'newPasswordCfm',
										emptyText : '此项不填则不更改密码',
										allowBlank : true,
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
										url : '../../character/user!update.action',
										params : {
											'user.id' : Ext.getCmp("userEditId").value,
											'user.username' : Ext.getCmp("username").value,
											'user.realName' : Ext.getCmp("realName").value,
											'newPassword' : encryptNewPassword,
											'newPasswordCfm' : encryptNewPasswordCfm,
											'user.active' : active,
											'rolesId' : Ext.getCmp("rolesId").value
										},

										success : function(response, options) {
											Ext.getCmp('userEditWin').close();
											jsonObj = Ext.decode(response.responseText);
											if (jsonObj.success == true) {
												userManageStoreEdit.reload();
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
