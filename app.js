(function(){
var KEY='cumbanetech_v1';
var CATS=['Portáteis','Desktops','Monitores','Acessórios','Componentes'];
function seed(){return{
  products:[
    {id:'p1',nome:'HP 250 G9',cat:'Portáteis',preco:24500,stock:8,specs:'Core i3 12ª ger., 8 GB RAM, SSD 256 GB, 15,6 pol.'},
    {id:'p2',nome:'Dell Latitude 5420',cat:'Portáteis',preco:38900,stock:4,specs:'Core i5 11ª ger., 16 GB RAM, SSD 512 GB, 14 pol.'},
    {id:'p3',nome:'Lenovo IdeaPad 3',cat:'Portáteis',preco:29900,stock:2,specs:'Ryzen 5, 8 GB RAM, SSD 512 GB, 15,6 pol.'},
    {id:'p4',nome:'Desktop Escritório Slim',cat:'Desktops',preco:21000,stock:6,specs:'Core i3, 8 GB RAM, SSD 256 GB, teclado e rato incluídos'},
    {id:'p5',nome:'Desktop Gamer RX',cat:'Desktops',preco:64000,stock:1,specs:'Ryzen 7, 16 GB RAM, SSD 1 TB, placa gráfica 8 GB'},
    {id:'p6',nome:'Monitor LED 22 pol.',cat:'Monitores',preco:7800,stock:12,specs:'Full HD, HDMI e VGA'},
    {id:'p7',nome:'Rato sem fios',cat:'Acessórios',preco:550,stock:30,specs:'2,4 GHz, receptor USB'},
    {id:'p8',nome:'Disco SSD 480 GB',cat:'Componentes',preco:3200,stock:0,specs:'SATA 2,5 pol., leitura 500 MB/s'}
  ],
  clients:[
    {id:'c1',nome:'Cliente de balcão',tel:''},
    {id:'c2',nome:'Escola Secundária (exemplo)',tel:'840000001'},
    {id:'c3',nome:'Ana Macie (exemplo)',tel:'840000002'}
  ],
  sales:[]
};}
var S;
function load(){try{var r=localStorage.getItem(KEY);if(r){S=JSON.parse(r);return}}catch(e){}S=seed();
  var d=new Date();d.setDate(d.getDate()-1);
  S.sales=[{id:'v1',data:d.toISOString(),cliente:'c2',pag:'Transferência',itens:[{pid:'p6',nome:'Monitor LED 22 pol.',qtd:3,preco:7800}],total:23400}];}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
load();

var $=function(s,r){return(r||document).querySelector(s)};
function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function mt(n){return Number(n||0).toLocaleString('pt-PT')+' MT'}
function uid(p){return p+Date.now().toString(36)+Math.floor(Math.random()*99)}
function dt(iso){var d=new Date(iso);return d.toLocaleDateString('pt-PT')+' '+d.toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'})}
function sameDay(a,b){return new Date(a).toDateString()===new Date(b).toDateString()}
function client(id){return S.clients.find(function(c){return c.id===id})}
function prod(id){return S.products.find(function(p){return p.id===id})}
var toastT;function toast(m){var t=$('.toast');if(t)t.remove();t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);clearTimeout(toastT);toastT=setTimeout(function(){t.remove()},2400)}
function stockPill(n){return n<=0?'<span class="pill bad">Esgotado</span>':n<=3?'<span class="pill warn">Restam '+n+'</span>':'<span class="pill ok">Em stock</span>'}

/* ---------- navegação ---------- */
var view='site',tab='painel',catFilter='Todos',cart=[];
function setView(v){view=v;$('#view-site').hidden=v!=='site';$('#view-gestao').hidden=v!=='gestao';
  $('#nav-site').setAttribute('aria-pressed',v==='site');$('#nav-gestao').setAttribute('aria-pressed',v==='gestao');
  if(v==='gestao')renderTab();else renderCatalog();window.scrollTo(0,0)}
$('#nav-site').onclick=function(){setView('site')};
$('#nav-gestao').onclick=function(){setView('gestao')};
$('#go-cat').onclick=function(e){e.preventDefault();$('#catalogo').scrollIntoView({behavior:'smooth'})};
$('#year').textContent=new Date().getFullYear();
$('#copy-tel').onclick=function(){var t='877304713';
  function ok(){toast('Número copiado: '+t)}
  try{navigator.clipboard.writeText(t).then(ok,function(){sel()})}catch(e){sel()}
  function sel(){var r=document.createRange();r.selectNodeContents($('#tel-text'));var s=getSelection();s.removeAllRanges();s.addRange(r);toast('Número selecionado: '+t)}};

/* ---------- loja pública ---------- */
function renderCatalog(){
  var cats=['Todos'].concat(CATS.filter(function(c){return S.products.some(function(p){return p.cat===c})}));
  if(cats.indexOf(catFilter)<0)catFilter='Todos';
  $('#cat-chips').innerHTML=cats.map(function(c){return'<button class="chip" data-c="'+esc(c)+'" aria-pressed="'+(c===catFilter)+'">'+esc(c)+'</button>'}).join('');
  var list=S.products.filter(function(p){return catFilter==='Todos'||p.cat===catFilter});
  $('#catalog').innerHTML=list.length?list.map(function(p){
    return'<article class="card"><span class="cat">'+esc(p.cat)+'</span><h3>'+esc(p.nome)+'</h3><p class="specs">'+esc(p.specs)+'</p>'+
    '<div class="foot"><span class="price num">'+mt(p.preco)+'</span>'+stockPill(p.stock)+'</div>'+
    '<a class="btn sm" target="_blank" rel="noopener" href="https://wa.me/258877304713?text='+encodeURIComponent('Olá, tenho interesse em: '+p.nome+' ('+mt(p.preco)+'). Ainda está disponível?')+'">Pedir no WhatsApp</a></article>'}).join('')
    :'<p class="empty">Ainda não há produtos neste catálogo.</p>';
}
$('#cat-chips').addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;catFilter=b.dataset.c;renderCatalog()});

/* ---------- gestão ---------- */
$('#tabs').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;tab=b.dataset.tab;renderTab()});
function renderTab(){
  document.querySelectorAll('#tabs button').forEach(function(b){b.setAttribute('aria-selected',b.dataset.tab===tab)});
  ({painel:tPainel,vendas:tVendas,produtos:tProdutos,clientes:tClientes})[tab]();
}
function salesTable(list){
  if(!list.length)return'<p class="empty">Ainda não há vendas registadas.</p>';
  return'<div class="tbl"><table><thead><tr><th>Data</th><th>Cliente</th><th>Itens</th><th>Pagamento</th><th class="r">Total</th></tr></thead><tbody>'+
  list.map(function(v){var c=client(v.cliente);
    return'<tr><td class="num">'+dt(v.data)+'</td><td>'+esc(c?c.nome:'—')+'</td><td>'+v.itens.map(function(i){return esc(i.nome)+' ×'+i.qtd}).join(', ')+'</td><td>'+esc(v.pag)+'</td><td class="r num">'+mt(v.total)+'</td></tr>'}).join('')+'</tbody></table></div>';
}
function tPainel(){
  var now=new Date(),hoje=0,mes=0,nHoje=0;
  S.sales.forEach(function(v){var d=new Date(v.data);
    if(sameDay(v.data,now)){hoje+=v.total;nHoje++}
    if(d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear())mes+=v.total});
  var low=S.products.filter(function(p){return p.stock<=3}).sort(function(a,b){return a.stock-b.stock});
  var valor=S.products.reduce(function(a,p){return a+p.preco*p.stock},0);
  $('#tab-body').innerHTML=
  '<div class="kpis">'+
  '<div class="kpi"><div class="l">Vendas hoje</div><div class="v num">'+mt(hoje)+'</div><div class="l" style="text-transform:none">'+nHoje+' venda(s)</div></div>'+
  '<div class="kpi"><div class="l">Vendas do mês</div><div class="v num">'+mt(mes)+'</div></div>'+
  '<div class="kpi"><div class="l">Valor em stock</div><div class="v num">'+mt(valor)+'</div></div>'+
  '<div class="kpi"><div class="l">Clientes</div><div class="v num">'+S.clients.length+'</div></div></div>'+
  '<div class="cols"><div class="panel"><h3>Últimas vendas</h3>'+salesTable(S.sales.slice().reverse().slice(0,6))+'</div>'+
  '<div class="panel"><h3>Stock a repor</h3>'+(low.length?'<div class="tbl"><table><thead><tr><th>Produto</th><th class="r">Stock</th><th></th></tr></thead><tbody>'+
  low.map(function(p){return'<tr><td>'+esc(p.nome)+'</td><td class="r num">'+p.stock+'</td><td>'+stockPill(p.stock)+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="empty">Todos os produtos têm stock suficiente.</p>')+'</div></div>';
}
function cartTotal(){return cart.reduce(function(a,i){return a+i.preco*i.qtd},0)}
function tVendas(){
  var avail=S.products.filter(function(p){return p.stock>0});
  $('#tab-body').innerHTML='<div class="sale-grid"><div class="panel"><h3>Registar venda</h3>'+
  '<div class="form"><label>Produto<select id="s-prod">'+(avail.length?avail.map(function(p){return'<option value="'+p.id+'">'+esc(p.nome)+' · '+mt(p.preco)+' ('+p.stock+')</option>'}).join(''):'<option value="">Sem stock</option>')+'</select></label>'+
  '<label>Quantidade<input id="s-qtd" type="number" min="1" value="1" inputmode="numeric"></label>'+
  '<button class="btn" id="s-add" type="button">Adicionar</button></div>'+
  '<div id="cart" style="margin-top:14px"></div></div>'+
  '<div class="panel"><h3>Fechar venda</h3><div class="form" style="grid-template-columns:1fr">'+
  '<label>Cliente<select id="s-cli">'+S.clients.map(function(c){return'<option value="'+c.id+'">'+esc(c.nome)+'</option>'}).join('')+'</select></label>'+
  '<label>Pagamento<select id="s-pag"><option>Numerário</option><option>M-Pesa</option><option>e-Mola</option><option>Transferência</option><option>Cartão</option></select></label></div>'+
  '<div class="cart-total"><span>Total</span><span class="num" id="s-total">0 MT</span></div>'+
  '<button class="btn primary" id="s-done" type="button" style="width:100%;margin-top:12px;padding:11px">Concluir venda</button></div></div>'+
  '<div class="panel" style="margin-top:16px"><h3>Histórico de vendas</h3>'+salesTable(S.sales.slice().reverse())+'</div>';
  drawCart();
  $('#s-add').onclick=function(){
    var id=$('#s-prod').value,q=parseInt($('#s-qtd').value,10);if(!id||!(q>0))return toast('Escolha o produto e a quantidade');
    var p=prod(id),ex=cart.find(function(i){return i.pid===id}),tot=(ex?ex.qtd:0)+q;
    if(tot>p.stock)return toast('Stock insuficiente: restam '+p.stock);
    if(ex)ex.qtd=tot;else cart.push({pid:id,nome:p.nome,qtd:q,preco:p.preco});
    drawCart()};
  $('#s-done').onclick=function(){
    if(!cart.length)return toast('Adicione pelo menos um produto');
    cart.forEach(function(i){var p=prod(i.pid);if(p)p.stock-=i.qtd});
    S.sales.push({id:uid('v'),data:new Date().toISOString(),cliente:$('#s-cli').value,pag:$('#s-pag').value,itens:cart.map(function(i){return{pid:i.pid,nome:i.nome,qtd:i.qtd,preco:i.preco}}),total:cartTotal()});
    cart=[];save();toast('Venda registada');tVendas()};
}
function drawCart(){
  var el=$('#cart');if(!el)return;
  el.innerHTML=cart.length?'<div class="tbl"><table><thead><tr><th>Produto</th><th class="r">Qtd</th><th class="r">Subtotal</th><th></th></tr></thead><tbody>'+
  cart.map(function(i,k){return'<tr><td>'+esc(i.nome)+'</td><td class="r num">'+i.qtd+'</td><td class="r num">'+mt(i.preco*i.qtd)+'</td><td class="r"><button class="btn sm" data-rm="'+k+'" type="button">Remover</button></td></tr>'}).join('')+'</tbody></table></div>':'<p class="empty">O carrinho está vazio. Escolha um produto e toque em Adicionar.</p>';
  $('#s-total').textContent=mt(cartTotal());
  el.querySelectorAll('[data-rm]').forEach(function(b){b.onclick=function(){cart.splice(+b.dataset.rm,1);drawCart()}});
}
var editId=null,delId=null;
function tProdutos(){
  var p=editId?prod(editId):null;
  $('#tab-body').innerHTML='<div class="panel"><h3>'+(p?'Editar produto':'Novo produto')+'</h3>'+
  '<form class="form" id="p-form"><label>Nome<input id="p-nome" required value="'+esc(p?p.nome:'')+'"></label>'+
  '<label>Categoria<select id="p-cat">'+CATS.map(function(c){return'<option'+(p&&p.cat===c?' selected':'')+'>'+c+'</option>'}).join('')+'</select></label>'+
  '<label>Preço (MT)<input id="p-preco" type="number" min="0" required inputmode="numeric" value="'+(p?p.preco:'')+'"></label>'+
  '<label>Stock<input id="p-stock" type="number" min="0" required inputmode="numeric" value="'+(p?p.stock:'')+'"></label>'+
  '<label style="grid-column:1/-1">Especificações<input id="p-specs" value="'+esc(p?p.specs:'')+'"></label>'+
  '<div style="display:flex;gap:8px"><button class="btn primary" type="submit">'+(p?'Guardar':'Adicionar')+'</button>'+(p?'<button class="btn" type="button" id="p-cancel">Cancelar</button>':'')+'</div></form></div>'+
  '<div class="panel" style="margin-top:16px"><h3>Produtos ('+S.products.length+')</h3><div class="tbl"><table><thead><tr><th>Produto</th><th>Categoria</th><th class="r">Preço</th><th class="r">Stock</th><th></th></tr></thead><tbody>'+
  S.products.map(function(x){return'<tr><td>'+esc(x.nome)+'</td><td>'+esc(x.cat)+'</td><td class="r num">'+mt(x.preco)+'</td><td class="r num">'+x.stock+' '+stockPill(x.stock)+'</td><td><div class="row-actions">'+
  (delId===x.id?'<button class="btn sm danger" data-yes="'+x.id+'" type="button">Confirmar</button><button class="btn sm" data-no type="button">Não</button>':
  '<button class="btn sm" data-ed="'+x.id+'" type="button">Editar</button><button class="btn sm danger" data-del="'+x.id+'" type="button">Apagar</button>')+'</div></td></tr>'}).join('')+'</tbody></table></div></div>';
  $('#p-form').onsubmit=function(e){e.preventDefault();
    var d={nome:$('#p-nome').value.trim(),cat:$('#p-cat').value,preco:+$('#p-preco').value,stock:parseInt($('#p-stock').value,10),specs:$('#p-specs').value.trim()};
    if(!d.nome)return;
    if(p)Object.assign(p,d);else S.products.push(Object.assign({id:uid('p')},d));
    editId=null;save();toast(p?'Produto atualizado':'Produto adicionado');tProdutos()};
  var c=$('#p-cancel');if(c)c.onclick=function(){editId=null;tProdutos()};
  var b=$('#tab-body');
  b.querySelectorAll('[data-ed]').forEach(function(x){x.onclick=function(){editId=x.dataset.ed;tProdutos();window.scrollTo(0,0)}});
  b.querySelectorAll('[data-del]').forEach(function(x){x.onclick=function(){delId=x.dataset.del;tProdutos()}});
  b.querySelectorAll('[data-no]').forEach(function(x){x.onclick=function(){delId=null;tProdutos()}});
  b.querySelectorAll('[data-yes]').forEach(function(x){x.onclick=function(){S.products=S.products.filter(function(q){return q.id!==x.dataset.yes});cart=cart.filter(function(i){return i.pid!==x.dataset.yes});delId=null;save();toast('Produto apagado');tProdutos()}});
}
function tClientes(){
  var tot={};S.sales.forEach(function(v){tot[v.cliente]=(tot[v.cliente]||0)+v.total});
  $('#tab-body').innerHTML='<div class="panel"><h3>Novo cliente</h3><form class="form" id="c-form"><label>Nome<input id="c-nome" required></label><label>Telefone<input id="c-tel" inputmode="tel"></label><button class="btn primary" type="submit">Adicionar</button></form></div>'+
  '<div class="panel" style="margin-top:16px"><h3>Clientes ('+S.clients.length+')</h3><div class="tbl"><table><thead><tr><th>Nome</th><th>Telefone</th><th class="r">Total comprado</th></tr></thead><tbody>'+
  S.clients.map(function(c){return'<tr><td>'+esc(c.nome)+'</td><td class="num">'+esc(c.tel||'—')+'</td><td class="r num">'+mt(tot[c.id]||0)+'</td></tr>'}).join('')+'</tbody></table></div></div>';
  $('#c-form').onsubmit=function(e){e.preventDefault();var n=$('#c-nome').value.trim();if(!n)return;
    S.clients.push({id:uid('c'),nome:n,tel:$('#c-tel').value.trim()});save();toast('Cliente adicionado');tClientes()};
}
var resetArmed=false;
$('#reset-btn').onclick=function(){
  if(!resetArmed){resetArmed=true;this.textContent='Toque de novo para confirmar';setTimeout(function(){resetArmed=false;$('#reset-btn').textContent='Repor dados de exemplo'},3500);return}
  resetArmed=false;this.textContent='Repor dados de exemplo';
  try{localStorage.removeItem(KEY)}catch(e){}load();cart=[];editId=null;delId=null;save();toast('Dados de exemplo repostos');renderTab()};

if(location.hash==='#gestao')setView('gestao');else renderCatalog();
})();
