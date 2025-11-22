# 🔧 Como Configurar CORS na API C# EcoLesson

## ❌ Problema

O erro que você está vendo:
```
Access to fetch at 'http://localhost:5030/api/v1/cursos' from origin 'http://localhost:8081' 
has been blocked by CORS policy
```

Isso acontece porque a API C# não está permitindo requisições do Expo (que roda em `http://localhost:8081`).

## ✅ Solução: Configurar CORS na API C#

### Para .NET 8 (Program.cs)

Abra o arquivo `Program.cs` da sua API e adicione a configuração de CORS:

```csharp
var builder = WebApplication.CreateBuilder(args);

// ... suas outras configurações ...

// ✅ ADICIONE ESTA CONFIGURAÇÃO DE CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowExpo", policy =>
    {
        policy.WithOrigins(
            "http://localhost:8081",  // Expo Web
            "http://localhost:19006", // Expo Web alternativo
            "http://localhost:3000",  // React Native Web
            "http://127.0.0.1:8081",
            "http://127.0.0.1:19006"
        )
        .AllowAnyMethod()      // Permite GET, POST, PUT, DELETE, etc.
        .AllowAnyHeader()      // Permite qualquer header
        .AllowCredentials();   // Permite cookies/credenciais
    });
});

var app = builder.Build();

// ✅ ADICIONE ESTA LINHA ANTES DE app.UseAuthorization()
app.UseCors("AllowExpo");

// ... resto do código ...
app.UseAuthorization();
app.MapControllers();
app.Run();
```

### Para .NET 6 ou anterior (Startup.cs)

Se você estiver usando `Startup.cs`, adicione no método `ConfigureServices`:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // ... outras configurações ...
    
    services.AddCors(options =>
    {
        options.AddPolicy("AllowExpo", policy =>
        {
            policy.WithOrigins(
                "http://localhost:8081",
                "http://localhost:19006",
                "http://localhost:3000"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
        });
    });
}
```

E no método `Configure`:

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // ... outras configurações ...
    
    app.UseCors("AllowExpo");
    
    app.UseAuthentication();
    app.UseAuthorization();
    // ... resto ...
}
```

### 🔓 Opção Mais Permissiva (Apenas para Desenvolvimento)

Se quiser permitir qualquer origem durante o desenvolvimento (⚠️ NÃO USE EM PRODUÇÃO):

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// No app.UseCors:
app.UseCors("AllowAll");
```

## 🧪 Testar

1. **Pare a API C#** (se estiver rodando)
2. **Adicione a configuração de CORS** no `Program.cs` ou `Startup.cs`
3. **Reinicie a API C#**
4. **Teste novamente no Expo**

A requisição deve funcionar agora! ✅

## 📝 Nota Importante

- A configuração de CORS deve estar **ANTES** de `UseAuthorization()` e `MapControllers()`
- Em produção, especifique apenas as origens permitidas (não use `AllowAnyOrigin()`)
- Se ainda não funcionar, verifique se a porta do Expo está correta (pode ser 19006 ao invés de 8081)

