// Can access the header files from the viewer...
#include "test_classes.h"
#include "ui/window.h"
#include <algorithm>
#include <catch2/catch.hpp>
#include <glm/gtc/type_ptr.hpp>


TEST_CASE("Gradient Volume Tests")
{
    volume::GradientVoxel gv = { glm::vec3(1.f, 0.f, 0.f), 1.f };
    volume::GradientVoxel res_gv = TestGradientVolume::test_linearInterpolate(gv, gv, 0.0f);
    REQUIRE(res_gv.dir == gv.dir);
    REQUIRE(res_gv.magnitude == gv.magnitude);

    volume::GradientVoxel gv1 = { glm::vec3(1.f, 0.f, 0.f), 1.f };
    volume::GradientVoxel gv2 = { glm::vec3(3.f, 2.f, 2.f), 2.f };
    res_gv = TestGradientVolume::test_linearInterpolate(gv1, gv2, 0.0f);
    REQUIRE(res_gv.dir == gv1.dir);
    REQUIRE(res_gv.magnitude == gv1.magnitude);

    res_gv = TestGradientVolume::test_linearInterpolate(gv1, gv2, 1.0f);
    REQUIRE(res_gv.dir == gv2.dir);
    REQUIRE(res_gv.magnitude == gv2.magnitude);

    res_gv = TestGradientVolume::test_linearInterpolate(gv1, gv2, 0.5f);
    REQUIRE((res_gv.dir.x < gv2.dir.x && res_gv.dir.y < gv2.dir.y && res_gv.dir.z < gv2.dir.z));
    REQUIRE((res_gv.dir.x > gv1.dir.x && res_gv.dir.y > gv1.dir.y && res_gv.dir.z > gv1.dir.z));
    REQUIRE(res_gv.magnitude < gv2.magnitude);
    REQUIRE(res_gv.magnitude > gv1.magnitude);

    const volume::Volume volume = volume::Volume(std::vector<uint16_t> { 1 }, glm::ivec3(1));
    const TestGradientVolume gradient { volume };
    REQUIRE_NOTHROW(gradient.test_getGradientLinearInterpolate(glm::vec3(100.f)));
}

TEST_CASE("Bisection Accuracy Tests") {
    const volume::Volume volume { std::vector<uint16_t>(125, 0), glm::ivec3(5) };
    const volume::GradientVolume gVolume { volume };
    // const TestRenderer tr { TestRenderer(volume, gVolume), };
    // TestRenderer()
    // TestRenderer::test_bisectionAccuracy()
}