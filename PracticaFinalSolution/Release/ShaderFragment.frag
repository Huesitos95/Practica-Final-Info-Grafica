#version 330 core

in vec2 TexCoords;
in vec3 normalOut;
in vec3 fragPosition;

out vec4 color;

uniform sampler2D img;

// Pasar por uniform la posicion de la camara
uniform vec3 viewerPosition;

// Direction Light 
// Direction of the light
vec3 dir = normalize(vec3(0.75, -0.75, 0.75));
// Color of the light
vec3 amb = vec3(1.0, 1.0, 1.0);


// PointLight
vec3 posPoint = vec3(0.0, 2.0, 0.0);
vec3 ambPoint = vec3(0.0, 0.0, 1.0);

vec4 directionalLight() {
	vec3 albedo = vec4(texture(img,TexCoords)).rgb;
	// ambient
	vec3 ambient = albedo * 0.2;

	// diffuse
	vec3 diff = albedo * 0.7 * max(dot(dir,normalOut), 0.0);

	// specular
	vec3 v = normalize(viewerPosition - fragPosition); 
	vec3 r = reflect(-dir, normalOut);
	float esp = max(dot(r,v), 0.0);
	vec3 spec = albedo * 0.3 * esp;

	return vec4(ambient + diff+ spec, 1.0);
}

vec4 pointLight() {
	vec3 albedo = vec4(texture(img,TexCoords)).rgb;

	vec3 lightDir = normalize(posPoint - fragPosition);
	// ambient
	vec3 ambient = albedo * 0.2;

	// diffuse
	vec3 diff = albedo * 0.7 * max(dot(lightDir,normalOut), 0.0);

	// specular
	vec3 v = normalize(viewerPosition - fragPosition); 
	vec3 r = reflect(-lightDir, normalOut);
	float esp = max(dot(r,v), 0.0);
	vec3 spec = albedo * 0.3 * esp;

	// Attenuation
	float distance = length(lightDir);
	float c1 = 1.0;
	float c2 = 0.7;
	float c3 = 1.8;
	float att = 1.0 / (c1 + c2 * distance + c3 *(distance * distance));
	return vec4(ambient + diff+ spec, 1.0)* att;
}

void main()
{   
	//color = directionalLight();
	//color = pointLight();
	color = directionalLight() + pointLight();
}