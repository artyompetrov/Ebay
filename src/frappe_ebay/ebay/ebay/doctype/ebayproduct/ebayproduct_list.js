frappe.listview_settings['EbayProduct'] = {

    
    onload(listview) {
        document.querySelectorAll('.list-row-col').forEach(function (coll) {
            coll.style.minWidth = "120px";
        });
        document.querySelectorAll('.list-subject').forEach(function (coll) {
            coll.style.minWidth = "120px";
        });
        document.querySelectorAll('.frappe-list').forEach(function (coll) {
            coll.style.overflowX = "auto";
        });
        
        document.querySelectorAll('.list-row .level-right').forEach(function (coll) {
            coll.style.flex = "0";
        });
        
        console.log("tezt")
    },
    formatters: {
        links(val,value_doc,doc) {

            let id = "links_"+doc.name;
            
            frappe.db.get_doc('EbayProduct', doc.name).then(function(r) {
                let items = r.ebay_search_names.map(x => {
                    const query = encodeURIComponent(x.ebay_name);
                    const url = `https://www.ebay.com/sch/i.html?_nkw=${query}`;
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${x.ebay_name}</a>`;
                });
                
                let element = document.querySelector("#" + id);
                if (element) {
                    element.innerHTML = items.join(" ");
                }
                 
            })
            
            return  `<div id='${id}'></div>`;
        }
    }
}