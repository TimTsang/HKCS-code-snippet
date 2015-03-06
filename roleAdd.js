/**
 * 
 * 角色增加窗口
 * 
 * @ProjectName: HK
 * @Package: KX.zjx
 * @ClassName: KX.zjx.roleAdd
 * @Description: 角色增加辑窗口
 * @Author: TimTsang
 * @CreateDate: 2015年02月02日
 * @Version: [v1.0]
 * 
 */
var addCheckedString = null;
var roleManageStoreAdd = null;
$(function() {
			// 将getCheckedString函数提到外部
			wGetCheckedString = getCheckedString;
			// 将getRoleManageStoreAdd函数提到外部
			wGetRoleManageStoreAdd = getRoleManageStoreAdd;
		});
function getCheckedString(checkedString) {
	addCheckedString = checkedString;
}
function getRoleManageStoreAdd(roleManageStore) {
	roleManageStoreAdd = roleManageStore;
}
Ext.define('KX.zjx.roleAdd', {
	id : 'roleAddWin',
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
						id : "roleAddId"
					}, {
						xtype : 'textfield',
						fieldLabel : "角色名称:",
						name : 'role.roleName',
						id : "roleName"
					}, {
						xtype : 'textfield',
						fieldLabel : "角色说明:",
						name : 'role.message',
						allowBlank : true,
						id : "message"
					}, {
						layout : {
							type : 'table',
							columns : 2
						},
						items : [{
									xtype : 'component',
									html : '权限分配:'
								}, {
									xtype : 'button',
									text : '权限分配',
									tooltip : '点击按钮对该角色进行权限分配',
									tdAttrs : {
										style : 'padding: 5px 10px;'
									},
									handler : function() {
										var roleName = Ext.getCmp('roleName').value;
										if (roleName) {
											Ext.create('KX.zjx.permissionToView',{
														'title' : '权限分配',
														'icon' : 'KX/zjx/icons/award_star_add.png',
														'modal' : true,
														'roleId' : ""
													}).show();
										} else {
											Ext.Msg.show({
														title : '温馨提示',
														msg : '请先将角色名称填写完整！',
														buttons : Ext.Msg.OK,
														icon : Ext.Msg.ERROR
													});
										}
									}
								}]
					}]
		});
		Ext.applyIf(me, {
					width : 300,
					height : 200,
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
						url : '../../character/role!saveRole.action',
						params : {
							'roleName' : Ext.getCmp("roleName").value,
							'message' : Ext.getCmp("message").value,
							'permissionIds' : addCheckedString
						},

						success : function(response, options) {
							Ext.getCmp('roleAddWin').close();
							jsonObj = Ext.decode(response.responseText);
							if (jsonObj.success == true) {
								roleManageStoreAdd.reload();
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
