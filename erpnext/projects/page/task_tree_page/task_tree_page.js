frappe.pages['task_tree_page'].on_page_load = function(wrapper) {
	new Mypage(wrapper);

}


// PAGE CONTENT	

Mypage = Class.extend({
	init:function(wrapper){
		this.page = frappe.ui.make_app_page({
			parent:wrapper,
			title:'Task Management',
			single_column:true
		});

		// make page
		this.make();
	},


	// Make Page
	make:function(){
		// Grab the class

		let me =$(this);

		// body conent
		let body =`<h1>Helow word</h1>`;

		// push dom to page 
		$(frappe.render_template(body,this)).appendTo(this.page.main)
	}

	// end of class
	
})



