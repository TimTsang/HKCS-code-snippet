/**
 * 
 * 角色编辑窗口
 * 
 * @ProjectName: HK
 * @Package: KX.zjx
 * @ClassName: KX.zjx.roleEdit
 * @Description: 角色编辑窗口
 * @Author: TimTsang
 * @CreateDate: 2015年01月31日
 * @Version: [v1.0]
 * 
 */
var roleManageStoreEdit = null;
// 将getUserManageStore函数提到外部
$(function() {
			wGetRoleManageStore = getRoleManageStore;
		});
function getRoleManageStore(roleManageStore) {
	roleManageStoreEdit = roleManageStore;
}
Ext.define('KX.zjx.roleEdit', {
			id : 'roleEditWin',
			extend : 'Ext.window.Window',
			resizable : false,
			myForm : null,
			initComponent : function() {
				var me = this;
				me.myForm = new Ext.FormPanel({
							// xtype: 'form',
							margin : '10 20 0 20',
							border : false,
							defaults : {
								xtype : 'textfield',
								allowBlank : false, // 不允许为空
								anchor : "0",
								labelWidth : 60,
								margin : '0 0 10 0'
							},
							items : [{
										xtype : 'textfield',
										name : 'role.id',
										hidden : true,
										hideLabel : true,
										allowBlank : true,
										id : "roleEditId"
									}, {
										fieldLabel : "角色名称",
										name : 'role.roleName',
										id : "roleName"
									}, {
										fieldLabel : "角色说明",
										name : 'role.message',
										allowBlank : true,
										id : "message"
									}]
						});
				Ext.applyIf(me, {
							width : 300,
							height : 160,
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

			onClose : function() {
				this.doClose();
			},

			submitForm : function() {
				if (this.myForm.getForm().isValid()) {
					Ext.Ajax.request({
								method : "POST",
								url : '../../character/role!update.action',
								params : {
									'id' : Ext.getCmp("roleEditId").value,
									'roleName' : Ext.getCmp("roleName").value,
									'message' : Ext.getCmp("message").value
								},

								success : function(response, options) {
									Ext.getCmp('roleEditWin').close();
									jsonObj = Ext.decode(response.responseText);
									if (jsonObj.success == true) {
										roleManageStoreEdit.reload();
										Ext.MessageBox.alert('温馨提示', '数据已经成功提交！');
									} else {
										Ext.MessageBox.alert('提交失败', "保存失败");
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
				} else {
					Ext.Msg.alert("温馨提示", "请检查填写表格！");
				}
			}
		});
