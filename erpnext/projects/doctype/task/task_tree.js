	frappe.provide("frappe.treeview_settings");

	frappe.treeview_settings['Task'] = {
		get_tree_nodes: "erpnext.projects.doctype.task.task.get_children",
		add_tree_node: "erpnext.projects.doctype.task.task.add_node",
		filters: [
			{
				fieldname: "project",
				fieldtype:"Link",
				options: "Project",
				label: __("Project"),
			},
			{
				fieldname: "task_category",
				fieldtype:"Link",
				options: "Task Category",
				label: __("Task Category"),
			},
			{
				fieldname: "task",
				fieldtype:"Link",
				options: "Task",
				label: __("Task"),
				get_query: function() {
					var me = frappe.treeview_settings['Task'];
					var project = me.page.fields_dict.project.get_value();
					var args = [["Task", 'is_group', '=', 1]];
					if(project){
						args.push(["Task", 'project', "=", project]);
					}
					return {
						filters: args
					};
				}
			}
		],
		breadcrumb: "Projects",
		get_tree_root: false,
		root_label: "All Tasks",
		ignore_fields: ["parent_task"],
		onload: function(me) {
			frappe.treeview_settings['Task'].page = {};
			$.extend(frappe.treeview_settings['Task'].page, me.page);
			me.make_tree();
		},
		toolbar: [
			{
				label:__("Add Multiple"),
				condition: function(node) {
					return node.expandable;
				},
				click: function(node) {
					this.data = [];
					const dialog = new frappe.ui.Dialog({
						title: __("Add Multiple Tasks"),
						fields: [
							{
								fieldname: "multiple_tasks", fieldtype: "Table",
								in_place_edit: true, data: this.data,
								get_data: () => {
									return this.data;
								},
								fields: [{
									fieldtype:'Data',
									fieldname:"subject",
									in_list_view: 1,
									reqd: 1,
									label: __("Subject")
								}]
							},
						],
						primary_action: function() {
							dialog.hide();
							return frappe.call({
								method: "erpnext.projects.doctype.task.task.add_multiple_tasks",
								args: {
									data: dialog.get_values()["multiple_tasks"],
									parent: node.data.value
								},
								callback: function() { }
							});
						},
						primary_action_label: __('Create')
					});
					dialog.show();
				}
			}
		],
		extend_toolbar: true
	};






















// //  BELOW IS WORKING CODE FOR FILTR


// frappe.provide("frappe.treeview_settings");

// frappe.treeview_settings['Task'] = {
//     get_tree_nodes: "erpnext.projects.doctype.task.task.get_children",
//     add_tree_node: "erpnext.projects.doctype.task.task.add_node",
//     filters: [
//         {
//             fieldname: "project",
//             fieldtype: "Link",
//             options: "Project",
//             label: __("Project"),
//         },
//         {
//             fieldname: "task_category",
//             fieldtype: "Link",
//             options: "Task Category",
//             label: __("Regulating Authority"),
//             get_query: function() {
//                 var me = frappe.treeview_settings['Task'];
//                 var project = me.page.fields_dict.project.get_value();
//                 var args = [['parent_task_category', '=', '']];
//                 if (project) {
//                     args.push(["Task Category", 'project', "=", project]);
//                     console.log("Task Category filters:", args);
//                 }
//                 return {
//                     filters: args
//                 };
//             },
//             onchange: function() {
//                 var me = frappe.treeview_settings['Task'];
//                 var task_category_value = this.get_value();
//                 console.log("Task Category value:", task_category_value);

//                 if (task_category_value) {
//                     frappe.call({
//                         method: "erpnext.projects.doctype.task.task.get_sub_task_categories",
//                         args: {
//                             task_category: task_category_value
//                         },
//                         callback: function(r) {
//                             if (r.message.length > 0) {
//                                 me.page.fields_dict.sub_task_category.df.get_query = function() {
//                                     return {
//                                         filters: [
//                                             ['name', 'in', r.message]
//                                         ]
//                                     };
//                                 };
//                                 me.page.fields_dict.sub_task_category.$wrapper.show();
//                                 console.log("Sub Task Category filters set:", r.message);
//                             } else {
//                                 me.page.fields_dict.sub_task_category.$wrapper.hide();
//                                 console.log("No Sub Task Categories found.");
//                             }
//                         }
//                     });
//                 } else {
//                     me.page.fields_dict.sub_task_category.$wrapper.hide();
//                 }
//             }
//         },
//         {
//             fieldname: "sub_task_category",
//             fieldtype: "Link",
//             options: "Task Category",
//             label: __("Task  Category Level 1"),
//             depends_on: 'eval:doc.task_category',
//             get_query: function() {
//                 var me = frappe.treeview_settings['Task'];
//                 var sub_task_category = me.page.fields_dict.sub_task_category.get_value();
//                 console.log("Sub Task Category value:", sub_task_category);

//                 var args = [];
//                 if (sub_task_category) {
//                     args.push(["Task", 'sub_task_category', "=", sub_task_category]);
//                     console.log("Sub Task Category filters:", args);
//                 }
//                 return {
//                     filters: args
//                 };
//             },
//             onchange: function() {
//                 var me = frappe.treeview_settings['Task'];
//                 var sub_task_category_value = this.get_value();
//                 console.log("Sub Task Category value:", sub_task_category_value);

//                 if (sub_task_category_value) {
//                     frappe.call({
//                         method: "erpnext.projects.doctype.task.task.get_task_sub_sub_categories",
//                         args: {
//                             sub_task_category: sub_task_category_value
//                         },
//                         callback: function(r) {
//                             if (r.message.length > 0) {
//                                 me.page.fields_dict.task_sub_sub_category.df.get_query = function() {
//                                     return {
//                                         filters: [
//                                             ['name', 'in', r.message]
//                                         ]
//                                     };
//                                 };
//                                 me.page.fields_dict.task_sub_sub_category.$wrapper.show();
//                                 console.log("Task Sub Sub Category filters set:", r.message);
//                             } else {
//                                 me.page.fields_dict.task_sub_sub_category.$wrapper.hide();
//                                 console.log("No Task Sub Sub Categories found.");
//                             }
//                         }
//                     });
//                 } else {
//                     me.page.fields_dict.task_sub_sub_category.$wrapper.hide();
//                 }
//             }
//         },
//         {
//             fieldname: "task_sub_sub_category",
//             fieldtype: "Link",
//             options: "Task Category",
//             label: __("Task  Category Level 2"),
//             depends_on: 'eval:doc.sub_task_category',
//             get_query: function() {
//                 var me = frappe.treeview_settings['Task'];
//                 var task_sub_sub_category = me.page.fields_dict.task_sub_sub_category.get_value();
//                 console.log("Task Sub Sub Category value:", task_sub_sub_category);

//                 var args = [];
//                 if (task_sub_sub_category) {
//                     args.push(["Task", 'task_sub_sub_category', "=", task_sub_sub_category]);
//                     console.log("Task Sub Sub Category filters:", args);
//                 }
//                 return {
//                     filters: args
//                 };
//             }
//         },
//         {
//             fieldname: "task",
//             fieldtype: "Link",
//             options: "Task",
//             label: __("Task"),
//             get_query: function() {
//                 var me = frappe.treeview_settings['Task'];
//                 var project = me.page.fields_dict.project.get_value();
//                 var task_category = me.page.fields_dict.task_category.get_value();
//                 var sub_task_category = me.page.fields_dict.sub_task_category.get_value();
//                 var task_sub_sub_category = me.page.fields_dict.task_sub_sub_category.get_value();
//                 console.log("Task filters:", { project, task_category, sub_task_category, task_sub_sub_category });

//                 var args = [["Task", 'is_group', '=', 1]];
//                 if (project) {
//                     args.push(["Task", 'project', "=", project]);
//                 }
//                 if (task_category) {
//                     args.push(["Task", 'task_category', "=", task_category]);
//                 }
//                 if (sub_task_category) {
//                     args.push(["Task", 'sub_task_category', "=", sub_task_category]);
//                 }
//                 if (task_sub_sub_category) {
//                     args.push(["Task", 'task_sub_sub_category', "=", task_sub_sub_category]);
//                 }
//                 console.log("Final Task filters:", args);
//                 return {
//                     filters: args
//                 };
//             }
//         }
//     ],
//     breadcrumb: "Projects",
//     get_tree_root: false,
//     root_label: "All Tasks",
//     ignore_fields: ["parent_task"],
//     onload: function(me) {
//         frappe.treeview_settings['Task'].page = {};
//         $.extend(frappe.treeview_settings['Task'].page, me.page);
//         me.make_tree();

//         // Hide the Sub Task Category and Sub Sub Task Category filters initially
//         me.page.fields_dict.sub_task_category.$wrapper.hide();
//         me.page.fields_dict.task_sub_sub_category.$wrapper.hide();

//         // Set up the onchange event for Task Category filter
//         me.page.fields_dict.task_category.df.onchange = function() {
//             var task_category_value = me.page.fields_dict.task_category.get_value();
//             var sub_task_category_filter = me.page.fields_dict.sub_task_category.$wrapper;
//             var task_sub_sub_category_filter = me.page.fields_dict.task_sub_sub_category.$wrapper;

//             if (task_category_value) {
//                 frappe.call({
//                     method: "erpnext.projects.doctype.task.task.get_sub_task_categories",
//                     args: {
//                         task_category: task_category_value
//                     },
//                     callback: function(r) {
//                         if (r.message.length > 0) {
//                             me.page.fields_dict.sub_task_category.df.get_query = function() {
//                                 return {
//                                     filters: [
//                                         ['name', 'in', r.message]
//                                     ]
//                                 };
//                             };
//                             sub_task_category_filter.show();
//                         } else {
//                             sub_task_category_filter.hide();
//                         }
//                     }
//                 });
//             } else {
//                 sub_task_category_filter.hide();
//             }

//             task_sub_sub_category_filter.hide();
//         };

//         // Set up the onchange event for Sub Task Category filter
//         me.page.fields_dict.sub_task_category.df.onchange = function() {
//             var sub_task_category_value = me.page.fields_dict.sub_task_category.get_value();
//             var task_sub_sub_category_filter = me.page.fields_dict.task_sub_sub_category.$wrapper;

//             if (sub_task_category_value) {
//                 frappe.call({
//                     method: "erpnext.projects.doctype.task.task.get_task_sub_sub_categories",
//                     args: {
//                         sub_task_category: sub_task_category_value
//                     },
//                     callback: function(r) {
//                         if (r.message.length > 0) {
//                             me.page.fields_dict.task_sub_sub_category.df.get_query = function() {
//                                 return {
//                                     filters: [
//                                         ['name', 'in', r.message]
//                                     ]
//                                 };
//                             };
//                             task_sub_sub_category_filter.show();
//                         } else {
//                             task_sub_sub_category_filter.hide();
//                         }
//                     }
//                 });
//             } else {
//                 task_sub_sub_category_filter.hide();
//             }
//         };
//     },
//     toolbar: [
//         {
//             label: __("Add Multiple"),
//             condition: function(node) {
//                 return node.expandable;
//             },
//             click: function(node) {
//                 this.data = [];
//                 const dialog = new frappe.ui.Dialog({
//                     title: __("Add Multiple Tasks"),
//                     fields: [
//                         {
//                             fieldname: "multiple_tasks", fieldtype: "Table",
//                             in_place_edit: true, data: this.data,
//                             get_data: () => {
//                                 return this.data;
//                             },
//                             fields: [{
//                                 fieldtype: 'Data',
//                                 fieldname: "subject",
//                                 in_list_view: 1,
//                                 reqd: 1,
//                                 label: __("Subject")
//                             }]
//                         },
//                     ],
//                     primary_action: function() {
//                         dialog.hide();
//                         return frappe.call({
//                             method: "erpnext.projects.doctype.task.task.add_multiple_tasks",
//                             args: {
//                                 data: dialog.get_values()["multiple_tasks"],
//                                 parent: node.data.value
//                             },
//                             callback: function() { }
//                         });
//                     },
//                     primary_action_label: __('Create')
//                 });
//                 dialog.show();
//             }
//         }
//     ],
//     extend_toolbar: true
// };












