import json
from xml.dom.minidom import parse

dom = parse("parsers/imobiliaria.xml")

imoveis = dom.getElementsByTagName('imovel')

imoveis_json = []

for imovel in imoveis:
    descricao = imovel.getElementsByTagName('descricao')[0].firstChild.nodeValue
    
    proprietario = imovel.getElementsByTagName('proprietario')[0]
    nome_proprietario = proprietario.getElementsByTagName('nome')[0].firstChild.nodeValue
    telefones = [telefone.firstChild.nodeValue for telefone in proprietario.getElementsByTagName('telefone')]
    elemento_email = proprietario.getElementsByTagName('email')
    email = elemento_email[0].firstChild.nodeValue if elemento_email else None
    
    endereco = imovel.getElementsByTagName('endereco')[0]
    rua = endereco.getElementsByTagName('rua')[0].firstChild.nodeValue
    bairro = endereco.getElementsByTagName('bairro')[0].firstChild.nodeValue
    cidade = endereco.getElementsByTagName('cidade')[0].firstChild.nodeValue
    elemento_numero = endereco.getElementsByTagName('numero')
    numero = elemento_numero[0].firstChild.nodeValue if elemento_numero else None
    
    caracteristicas = imovel.getElementsByTagName('caracteristicas')[0]
    tamanho = caracteristicas.getElementsByTagName('tamanho')[0].firstChild.nodeValue
    num_quartos = caracteristicas.getElementsByTagName('numQuartos')[0].firstChild.nodeValue
    num_banheiros = caracteristicas.getElementsByTagName('numBanheiros')[0].firstChild.nodeValue
    
    valor_elements = imovel.getElementsByTagName('valor')
    valor = valor_elements[0].firstChild.nodeValue if valor_elements else None
    
    imoveis_json.append({
        "descricao": descricao,
        "proprietario": {
            "nome": nome_proprietario,
            "telefones": telefones,
            "email": email
        },
        "endereco": {
            "rua": rua,
            "bairro": bairro,
            "cidade": cidade,
            "numero": numero
        },
        "caracteristicas": {
            "tamanho": tamanho,
            "numQuartos": num_quartos,
            "numBanheiros": num_banheiros
        },
        "valor": valor
    })

with open("parsers/imobiliaria.json", "w", encoding="utf-8") as json_file:
    json.dump(imoveis_json, json_file, ensure_ascii=False, indent=4)

print("Arquivo JSON gerado com sucesso!")