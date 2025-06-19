from xml.dom.minidom import parse

dom = parse("parsers/cardapio.xml")

cardapio = dom.documentElement

pratos = cardapio.getElementsByTagName('prato')

print("Cardápio:")
for prato in pratos:
    id = prato.getAttribute('id')
    nome = prato.getElementsByTagName('nome')[0].firstChild.nodeValue
    print(f"{id} - {nome}")

id_lido = int(input("Digite o id do prato para saber mais: "))
prato = pratos[id_lido-1]
print("---\n")

nome = prato.getElementsByTagName('nome')[0].firstChild.nodeValue
descricao = prato.getElementsByTagName('descricao')[0].firstChild.nodeValue
ingredientes = []
for ingrediente in prato.getElementsByTagName('ingrediente'):
    ingredientes.append(ingrediente.firstChild.nodeValue)
preco = prato.getElementsByTagName('preco')[0].firstChild.nodeValue
calorias = prato.getElementsByTagName('calorias')[0].firstChild.nodeValue
tempoPreparo = prato.getElementsByTagName('tempoPreparo')[0].firstChild.nodeValue

print("Nome:", nome)
print("Descrição:", descricao)
print("Ingredientes:", ", ".join(ingredientes))
print("Preço:", preco)
print("Calorias:", calorias)
print("Tempo de Preparo:", tempoPreparo)
