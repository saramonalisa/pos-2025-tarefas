from xml.dom.minidom import parse

dom = parse("parsers/cardapio.xml")

cardapio = dom.documentElement

pratos = cardapio.getElementsByTagName('prato')
 
print("Cardápio:")
for prato in pratos:
    id = prato.getAttribute('id')
    nome = prato.getElementsByTagName('nome')[0].firstChild.nodeValue
    descricao = prato.getElementsByTagName('descricao')[0].firstChild.nodeValue
    ingredientes = prato.getElementsByTagName('ingredientes')[0].firstChild.nodeValue
    preco = prato.getElementsByTagName('preco')[0].firstChild.nodeValue
    calorias = prato.getElementsByTagName('calorias')[0].firstChild.nodeValue
    tempoPreparo = prato.getElementsByTagName('tempoPreparo')[0].firstChild.nodeValue
    
    print(f"{prato.getAttribute('id')} - {prato}")
id_lido = int(input("Digite o id do prato para saber mais: "))
print(f"Nome: {nome}")
print(f"Descrição: {descricao}")
print(f"Ingredientes: {ingredientes}")
print(f"Preço: {preco}")
print(f"Calorias: {calorias}")
print(f"Tempo de preparo: {tempoPreparo}")