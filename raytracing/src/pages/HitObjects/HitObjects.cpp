#ifndef VEC3_H
#define VEC3_H
#include <cmath>
#include <iostream>
#include <string>
#include <cstring>
#include <sstream>
#include <vector>
#include <thread>
#include <mutex>

using std::sqrt;
using std::fabs;

class vec3 {
    public:
        vec3() : e{0,0,0} {}
        vec3(double e0, double e1, double e2) : e{e0, e1, e2} {}

        double x() const { return e[0]; }
        double y() const { return e[1]; }
        double z() const { return e[2]; }

        vec3 operator-() const { return vec3(-e[0], -e[1], -e[2]); }
        double operator[](int i) const { return e[i]; }
        double& operator[](int i) { return e[i]; }

        vec3& operator+=(const vec3 &v) {
            e[0] += v.e[0];
            e[1] += v.e[1];
            e[2] += v.e[2];
            return *this;
        }

        vec3& operator*=(const double t) {
            e[0] *= t;
            e[1] *= t;
            e[2] *= t;
            return *this;
        }

        vec3& operator/=(const double t) {
            return *this *= 1/t;
        }

        double length() const {
            return sqrt(length_squared());
        }

        double length_squared() const {
            return e[0]*e[0] + e[1]*e[1] + e[2]*e[2];
        }

        bool near_zero() const {
            // Return true if the vector is close to zero in all dimensions.
            const auto s = 1e-8;
            return (fabs(e[0]) < s) && (fabs(e[1]) < s) && (fabs(e[2]) < s);
        }
        const char* to_vec3_string() const {
            std::string str = std::to_string(e[0]) + "&" + std::to_string(e[1]) + "&" + std::to_string(e[2]);
            char* cString = new char[str.length() + 1]; 

            strcpy(cString, str.c_str()); 

            return cString;
        }


    public:
        double e[3];
};


// Type aliases for vec3
using point3 = vec3;   // 3D point
using color = vec3;    // RGB color


// vec3 Utility Functions

inline std::ostream& operator<<(std::ostream &out, const vec3 &v) {
    return out << v.e[0] << ' ' << v.e[1] << ' ' << v.e[2];
}

inline vec3 operator+(const vec3 &u, const vec3 &v) {
    return vec3(u.e[0] + v.e[0], u.e[1] + v.e[1], u.e[2] + v.e[2]);
}

inline vec3 operator-(const vec3 &u, const vec3 &v) {
    return vec3(u.e[0] - v.e[0], u.e[1] - v.e[1], u.e[2] - v.e[2]);
}

inline vec3 operator*(const vec3 &u, const vec3 &v) {
    return vec3(u.e[0] * v.e[0], u.e[1] * v.e[1], u.e[2] * v.e[2]);
}

inline vec3 operator*(double t, const vec3 &v) {
    return vec3(t*v.e[0], t*v.e[1], t*v.e[2]);
}

inline vec3 operator*(const vec3 &v, double t) {
    return t * v;
}

inline vec3 operator/(vec3 v, double t) {
    return (1/t) * v;
}

inline double dot(const vec3 &u, const vec3 &v) {
    return u.e[0] * v.e[0]
         + u.e[1] * v.e[1]
         + u.e[2] * v.e[2];
}

inline vec3 cross(const vec3 &u, const vec3 &v) {
    return vec3(u.e[1] * v.e[2] - u.e[2] * v.e[1],
                u.e[2] * v.e[0] - u.e[0] * v.e[2],
                u.e[0] * v.e[1] - u.e[1] * v.e[0]);
}
inline vec3 unit_vector(vec3 v) {
    return v.length() < 0.00000001 ? vec3(0,0,0) : v / v.length();
}

class ray {
    public:
        ray() {}
        ray(const point3& origin, const vec3& direction)
            : orig(origin), dir(direction)
        {}

        point3 origin() const  { return orig; }
        vec3 direction() const { return dir; }

        point3 at(double t) const {
            return orig + t*dir;
        }

    public:
        point3 orig;
        vec3 dir;
};


bool hit_sphere(const point3& center, double radius, const ray& r) {
    vec3 oc = r.origin() - center;
    auto a = dot(r.direction(), r.direction());
    auto b = 2.0 * dot(oc, r.direction());
    auto c = dot(oc, oc) - radius*radius;
    auto discriminant = b*b - 4*a*c;
    return (discriminant > 0);
}
#endif


std::vector<double> change_js_vec3_str_to_array(char* str) {
    std::vector<double> data;
    std::istringstream iss(str);
    std::string token;
    while (std::getline(iss, token, '&')) {
        data.push_back(std::atof(token.c_str()));
    }
    return data;
}


color ray_color(const ray& r,double radius) {
    if (hit_sphere(point3(.5,.5,-1), radius, r))
        return color(0, 0, 0);
    vec3 unit_direction = unit_vector(r.direction());
    auto t = 0.5*(unit_direction.y() + 1.0);
    return (1.0-t)*color(1.0, 1.0, 1.0)*255 + t*color(0.5, 0.7, 1.0)*255;
}


const int NUM_THREADS = std::thread::hardware_concurrency(); // 定义线程数量
std::mutex colorDataMutex; // 定义互斥锁

// 定义线程执行的任务函数
void computeColorData(int threadID, int width, int height, double radius, std::vector<std::string>& colorData) {
    double du = 1. / width;
    double dv = 1. / height;
    double u = 0.5 / width + du * threadID;
    double v = .5 / height;

    for (int x = threadID; x < width; x += NUM_THREADS) {
        u += NUM_THREADS * du;
        v = .5 / height;

        for (int y = 0; y < height; y++) {
            v += dv;
            vec3 direction = vec3(u, v, 0) - vec3(0.5, 0.5, 1);
            vec3 origin = vec3(0.5, 0.5, 1);
            ray r(origin, direction);
            vec3 pixel_color = ray_color(r, radius);
            std::string data = std::to_string(x) + "#" + std::to_string(y) + "#" + pixel_color.to_vec3_string();
            
            // 加锁，保证线程安全地访问共享的 colorData
            std::lock_guard<std::mutex> lock(colorDataMutex);
            colorData.push_back(data);
        }
    }
}


extern "C"{
    const char* getCanvasColorData(int width,int height,double radius){
        double du = 1./width, dv = 1./height;
        double u = 0.5/width, v = .5/height;
        static std::string colorData = "";
        vec3 pixel_color;
        for (int x = 0; x < width; x++) {
            u += du; v = .5/height;;
            for (int y = 0; y < height; y++) {
                v+=dv;
                vec3 direction =  vec3(u,v,0) - vec3(0.5,0.5,1);
                vec3 origin =  vec3(0.5,0.5,1);
                ray r(origin,direction);
                pixel_color = ray_color(r,radius);
                // std::cout << pixel_color;
                colorData += std::to_string(x)+"#"+std::to_string(y)+"#"+pixel_color.to_vec3_string()+"|";
            }
        }

        // return colorData.c_str();
        return "a";
    }



    const char* getCanvasColorData(int width, int height, double radius) {
        std::vector<std::string> colorData;
        std::vector<std::thread> threads;

        // 创建多个线程，并分配任务
        for (int i = 0; i < NUM_THREADS; i++) {
            threads.emplace_back(computeColorData, i, width, height, radius, std::ref(colorData));
        }

        // 等待所有线程执行完成
        for (auto& thread : threads) {
            thread.join();
        }

        // 拼接 colorData 字符串
        static std::string result = "";
        for (const std::string& data : colorData) {
            result += data + "|";
        }

        // 返回结果
        return result.c_str();
    }

}




