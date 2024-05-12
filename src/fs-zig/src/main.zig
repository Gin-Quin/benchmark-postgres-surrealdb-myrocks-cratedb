const std = @import("std");
const rand = std.crypto.random;

const COUNT = 2048;

pub fn main() !void {
    // const data = ids.map(id => ({
    //     key: ids[0],
    //     value: randomBytes(1024),
    // }))

    var ids = std.mem.zeroes([COUNT][32]u8);
    var data = std.mem.zeroes([COUNT][1024]u8);
    var paths = std.mem.zeroes([COUNT][6 + 32]u8); // 'files/' + id

    std.debug.print("ids length: {}\n", .{ids.len});

    for (0..COUNT) |index| {
        for (0..32) |offset| {
            ids[index][offset] = rand.intRangeAtMost(u8, 'a', 'z');
            std.mem.copyForwards(u8, &paths[index], "files/");
            _ = try std.fmt.bufPrint((paths[index][6..]), "{s}", .{ids[index]});
            // std.mem.copyForwards(u8, &paths[index][6..], ids[index]);
        }
        rand.bytes(&data[index]);
    }

    const now = std.time.milliTimestamp();

    for (0..COUNT) |index| {
        // std.debug.print("writing file {s}\n", .{paths[index]});
        // var path = std.ArrayList(u8).init(std.heap.page_allocator);
        // defer path.deinit();
        // try path.appendSlice("files/");
        // try path.appendSlice(&ids[index]);
        try writeFile(&paths[index], &data[index]);
    }

    const elapsed = std.time.milliTimestamp() - now;
    std.debug.print("elapsed: {}ms\n", .{elapsed});
}

fn writeFile(path: []const u8, data: []const u8) !void {
    const file = try std.fs.cwd().createFile(path, .{ .truncate = true });
    try file.writeAll(data);
    file.close();
}

fn concat(allocator: *std.mem.Allocator, one: []const u8, two: []const u8) !std.Buffer {
    var result = try std.Buffer.init(allocator, one);
    try result.append(two);
    return result;
}
