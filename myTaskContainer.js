/**
 * 
 * 查看我的任务
 * 
 * @ProjectName: HK
 * @Package: KX.zjx
 * @ClassName: KX.zjx.myTaskContainer
 * @Description: 查看我的任务全部信息
 * @Author: TimTsang
 * @CreateDate: 2014年12月07日
 * @Version: [v1.0]
 * 
 */

Ext.define('KX.zjx.myTaskContainer', {
	extend : 'Ext.panel.Panel',
	id : 'KX.zjx.myTaskContainer',
	layout : 'border',
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			items : [{
				xtype : 'form',
				id : 'taskFromContainer',
				region : 'north',
				layout : {
					type : 'hbox',
					align : 'stretch'
					,
				},
				defaults : {
					flex : 1,
					border : false,
					xtype : 'form'
				},
				items : [{
							// 第一列表单
							defaults : {
								xtype : 'textfield',
								labelWidth : 70,
								padding : 10,
								anchor : '0'
							},
							items : [{
										fieldLabel : '任务名称',
										name : 'text'
									}, {
										fieldLabel : '编号',
										name : 'id'
									}]
						}, {
							// 第二列表单
							defaults : {
								labelWidth : 70,
								padding : 10,
								anchor : '0'
							},
							items : [{
										xtype : 'combo',
										fieldLabel : '部门类型',
										store : Ext.create(
												"Ext.data.ArrayStore", {
													fields : ['departmentType'],
													data : [['负责'], ['协助']]
												}),
										typeAhead : true,
										editable : false,
										displayField : 'departmentType',
										value : '负责',
										mode : 'local',
										name : 'departmentType'
									}, {
										xtype : 'datefield',
										fieldLabel : '发布时间',
										name : 'createTime',
										editable : false
									}]
						}, {
							// 第三列表单
							defaults : {
								labelWidth : 70,
								padding : 10,
								anchor : '0'
							},
							items : [{
										xtype : 'textfield',
										labelWidth : 70,
										padding : 10,
										anchor : '0',
										fieldLabel : '部门名称',
										name : 'text'
									}, {
										xtype : 'datefield',
										fieldLabel : '接收时间',
										// labelWidth: 30,
										name : 'acceptTime',
										editable : false
									}]
						}, {
							// 第四列表单
							items : [{
										xtype : 'combo',
										fieldLabel : '处理状态',
										labelWidth : 70,
										store : Ext.create(
												"Ext.data.ArrayStore", {
													fields : ['state'],
													data : [['未处理'], ['进行中'],
															['办结']]
												}),
										typeAhead : true,
										editable : false,
										displayField : 'state',
										value : '未处理',
										mode : 'local',
										padding : 10,
										anchor : '0',
										name : 'state'
									}, {
										border : false,
										anchor : '0',
										padding : '0 10 0 0',
										layout : {
											type : 'hbox',
											pack : 'end'
										},
										defaults : {
											width : 75,
											height : 28,
											margin : '0 0 0 20',
											xtype : 'button'
										},
										items : [{
													text : '查询',
													handler : function() {
														// taskStore.clearFilter(true);
														// taskStore.reload();
														// var valuesO =
														// Ext.getCmp('taskFromContainer').getForm().getValues();
														// var valuesA = [];
														// Ext.Object.each(valuesO,
														// function(key,value){
														// if(value != '' &&
														// value != '所有'){
														// valuesA.push(key+'
														// '+value);
														// }
														// });
														// Ext.Array.each(valuesA,function(name){
														// taskStore.filter(name.split('
														// ')[0], name.split('
														// ')[1]);
														// });
													}
												}, {
													text : '重置',
													handler : function() {
														Ext.Msg.confirm('系统提示',
																'您确定要重置表单吗?',
																function(btn) {
																	if (btn == 'yes') {
																		var forms = Ext
																				.getCmp('taskFromContainer').items;
																		forms
																				.each(
																						function(
																								i) {
																							i
																									.getForm()
																									.reset();
																						});
																	}
																});
													}
												}]
									}]
						}]
			}, {
				items : [Ext.create('Ext.grid.Panel', {
					header : false,
					id : 'taskGrid',
					store : Ext.create('KX.zjx.taskListStore'),
					columnLines : true,
					listeners : {
						cellclick : function(iView, iCellEl, iColIdx, iRecord,
								iRowEl, iRowIdx, iEvent) {
							if (iColIdx == 7) {
								var id = iRecord.data.id;
								var title = iRecord.data.title;
								title = title.length > 5 ? title.slice(0, 5)
										+ '... - 任务详情' : title + ' - 任务详情';
								KX.globalFunction.addTab(id, title,
										'KX.xpq.EventDetials_win', 'page.png');
							} else if (iColIdx == 8) {
								var title = iRecord.data.title;
								var id = iRecord.data.id + ' taskSupplement';
								title = title.length > 5 ? title.slice(0, 5)
										+ '... - 任务补充' : title + ' - 任务补充';
								KX.globalFunction.createWin(id, title,
										'KX.ljb.taskSupplement', true, false);
							}
						}
					},
					dockedItems : [Ext.create('Ext.toolbar.Paging', {
						dock : 'bottom',
						store : Ext.create('KX.zjx.taskListStore'),
						pageSize : 20,
						displayInfo : true,
						listeners : {
							beforechange : function() {
								this.getStore().load({
									method : 'post',
									params : {
										"userId" : Ext.getCmp('userRegisterId').value
									}
								});
								Ext.getCmp('ListGrid').getStore().load({
									method : 'post',
									params : {
										"userId" : Ext.getCmp('userRegisterId').value
									}
								});
							}
						}
					})],
					columns : column
				})],
				border : false,
				layout : 'fit',
				region : 'center'
				,
			}]

		});

		me.callParent(arguments);
	}
	,

});

var column = {
	items : [{
				text : '编号',
				resizable : false,
				menuDisabled : true,
				flex : 1,
				dataIndex : 'id'
			}, {
				text : '任务名称',
				resizable : false,
				menuDisabled : true,
				flex : 1,
				dataIndex : 'text'
			}, {
				text : '部门类型',
				resizable : false,
				menuDisabled : true,
				flex : 0.8,
				dataIndex : 'departmentType'
			}, {
				text : '部门名称',
				resizable : false,
				menuDisabled : true,
				flex : 1,
				dataIndex : 'departmentName'
			}, {
				text : '任务状态',
				resizable : false,
				menuDisabled : true,
				flex : 0.8,
				dataIndex : 'state',
				renderer : function(value) {
					if (value == '未完成') {
						return "<span class='ljb_red'>" + value + "</span>";
					} else if (value == '已完成') {
						return "<span class='ljb_blue'>" + value + "</span>";
					} else {
						return "<span class='ljb_green'>" + value + "</span>";
					}
				}
			}, {
				text : '发布时间',
				resizable : false,
				menuDisabled : true,
				flex : 1,
				dataIndex : 'createTime'
			}, {
				text : '接收时间',
				resizable : false,
				menuDisabled : true,
				flex : 1,
				dataIndex : 'acceptTime'
			}, {
				text : '查看',
				resizable : false,
				menuDisabled : true,
				flex : 0.5,
				renderer : function() {
					return "<img class='ljb_pointer' src='../../amsin/shared/icons/fam/page.png'/>";
				}
			}, {
				text : '任务补充',
				resizable : false,
				menuDisabled : true,
				flex : 0.6,
				renderer : function() {
					return "<img class='ljb_pointer' src='../../amsin/shared/icons/fam/comment_add.png'/>";
				}
			}]
};
