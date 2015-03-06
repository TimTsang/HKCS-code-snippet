/**
 * 
 * 查询应急人员窗口
 * 
 * @ProjectName: HK
 * @Package: KX.zjx
 * @ClassName: KX.zjx.searchEmPerson
 * @Description: 查询应急人员窗口
 * @Author: TimTsang
 * @CreateDate: 2015年2月7日
 * @Version: [v1.0]
 * 
 */
var searchEmPersonStore = null;
// 将getSearchEmPersonStore函数提到外部
$(function() {
			wGetSearchEmPersonStore = getSearchEmPersonStore;
		});
function getSearchEmPersonStore(emPersonStore) {
	searchEmPersonStore = emPersonStore;
}
Ext.define('KX.zjx.searchEmPerson', {
	id : 'searchEmPersonWin',
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
						labelWidth : 90,
						margin : '0 0 10 0'
					},
					items : [{
								fieldLabel : "应急人员名称",
								id : "staffName"
							}]
				});
		Ext.applyIf(me, {
					width : 300,
					height : 130,
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
		// 键盘操作
		document.onkeydown = function(e) {
			var ev = document.all ? window.event : e;
			if (ev.keyCode == 13) {
				try {
					searchEmPersonStore.reload({
						method : 'POST',
						params : {
							"emergencyStaffName" : Ext.getCmp('staffName').value,
							"queryType" : 2
						}
					});
					me.onClose();
				} catch (e) {
					console.dir("应急人员查询窗口缺失！");
				}

			}
		};
		me.callParent(arguments);
	},

	onClose : function() {
		this.doClose();
	},

	submitForm : function() {
		try {
			searchEmPersonStore.reload({
						method : 'POST',
						params : {
							"emergencyStaffName" : Ext.getCmp('staffName').value,
							"queryType" : 2
						}
					});
			me.onClose();
		} catch (e) {
			console.dir("应急人员查询窗口缺失！");
		}
	}
});
