import json

with open("parsers/imobiliaria.json", "r", encoding="utf-8") as json_file:
    imobiliaria = json.load(json_file)  # Carrega o JSON como uma lista de imóveis

print("Imóveis:")
id = 0
for imovel in imobiliaria:
    id += 1
    descricao = imovel["descricao"]  # Acessa diretamente a chave "descricao"
    print(f"{id} - {descricao}")

id_lido = int(input("Digite o id do imóvel para saber mais: "))
imovel = imobiliaria[id_lido - 1]  # Acessa o imóvel pelo índice (ID - 1)

descricao = imovel["descricao"]

proprietario = imovel["proprietario"]
nome_proprietario = proprietario["nome"]
telefones = proprietario["telefones"]
email = proprietario.get("email", "Não disponível")

endereco = imovel["endereco"]
rua = endereco["rua"]
bairro = endereco["bairro"]
cidade = endereco["cidade"]
numero = endereco.get("numero", "Sem número")

caracteristicas = imovel["caracteristicas"]
tamanho = caracteristicas["tamanho"]
num_quartos = caracteristicas["numQuartos"]
num_banheiros = caracteristicas["numBanheiros"]

valor = imovel.get("valor", "Não informado")

print("\nDetalhes do imóvel:")
print(f"Descrição: {descricao}")
print(f"Proprietário: {nome_proprietario}")
print(f"Telefones: {', '.join(telefones)}")
print(f"Email: {email}")
print(f"Endereço: {rua}, {numero}, {bairro}, {cidade}")
print(f"Características: {tamanho}m², {num_quartos} quartos, {num_banheiros} banheiros")
print(f"Valor: R$ {valor}")
