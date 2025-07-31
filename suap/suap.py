import requests
from getpass import getpass

api_url = "https://suap.ifrn.edu.br/api/"

user = input("Usuário: ")
password = getpass("Senha: ")

data = {"username": user, "password": password}

response = requests.post(api_url + "v2/autenticacao/token/", json=data)
if response.status_code == 200:
    token = response.json().get("access")
    if not token:
        print("Erro: Token de acesso não encontrado.")
        exit()
else:
    print("Erro ao autenticar:", response.status_code, response.text)
    exit()

headers = {
    "Authorization": f"Bearer {token}"
}

def get_nota(etapa):
    return etapa.get("nota") if etapa and etapa.get("nota") is not None else "--"

def boletim():
    response = requests.get(api_url + "edu/meu-boletim/2025/1", headers=headers)
    if response.status_code == 200:
        boletim_data = response.json()
        
        print(f"{'Disciplina':<80}{'1ª Etapa':<10}{'2ª Etapa':<10}{'3ª Etapa':<10}{'4ª Etapa':<10}")
        print("-" * 120)
        
        for item in boletim_data:
            disciplina = item.get("disciplina", "Desconhecida")
            notas = [get_nota(item.get(f"nota_etapa_{i}")) for i in range(1, 5)]
            print(f"{disciplina:<80}{notas[0]:<10}{notas[1]:<10}{notas[2]:<10}{notas[3]:<10}")
        
        print("-" * 120)
    else:
        print("Erro ao buscar o boletim:", response.status_code, response.text)

boletim()
